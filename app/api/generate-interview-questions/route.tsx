import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
import { aj } from "@/utils/arcjet";
import { currentUser } from "@clerk/nextjs/server";
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL!;

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY!;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT!;

if (!publicKey || !privateKey || !urlEndpoint || !n8nWebhookUrl) {
    throw new Error("Missing required environment variables.");
}
var imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
});

export async function POST(req: NextRequest) {
    try {
        const user = await currentUser();
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const jobTitle = formData.get("jobTitle") as string;
        const jobDescription = formData.get("jobDescription") as string;

        const decision = await aj.protect(req, {
            userId: user?.primaryEmailAddress?.emailAddress ?? "",
            requested: 5,
        }); // Deduct 5 tokens from the bucket
        console.log("Arcjet decision", decision);

        
        if (decision?.isDenied()) {
            return NextResponse.json(
                { error: "You have exceeded your request limit. Please try again after 24 hours.", reason: decision.reason },
                { status: 429 }
            );
        }

        let resumeUrl = "";

        if (file) {
            // Handle file upload
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadPdf = await imagekit.upload({
                file: buffer,
                fileName: `${Date.now()}-${file.name}`,
                isPrivateFile: false,
            });

            resumeUrl = uploadPdf.url;
        } else if (!jobTitle || !jobDescription) {
            // Validate that either file exists or both job fields are provided
            return NextResponse.json(
                {
                    error: "Either resume file or both job title and job description are required",
                },
                { status: 400 }
            );
        }

        // Call n8n webhook with better error handling
        try {
            const webhookPayload = file
                ? { resumeUrl }
                : { jobTitle, jobDescription };

            const result = await axios.post(n8nWebhookUrl, webhookPayload, {
                timeout: 120000,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const questionsText = result.data.content.parts[0].text;
            const interviewQuestions = JSON.parse(questionsText);

            return NextResponse.json(
                {
                    url: resumeUrl,
                    interviewQuestions: interviewQuestions,
                    metadata: {
                        finishReason: result.data.finishReason,
                    },
                },
                { status: 200 }
            );
        } catch (webhookError: any) {
            console.error("Webhook failed:", webhookError.message);
            console.error(
                "Webhook error details:",
                webhookError.response?.data
            );

            return NextResponse.json(
                {
                    url: resumeUrl,
                    warning: file
                        ? "File uploaded successfully but webhook processing failed"
                        : "Webhook processing failed",
                    error: webhookError.message,
                },
                { status: 200 }
            );
        }
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            {
                error: File
                    ? "File upload failed"
                    : "Request processing failed",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
