import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import axios from "axios";
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
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: "No valid file provided" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadPdf = await imagekit.upload({
            file: buffer,
            fileName: `${Date.now()}-${file.name}`,
            isPrivateFile: false,
        });

        // Call n8n webhook with better error handling
        try {
            const result = await axios.post(
                n8nWebhookUrl,
                {
                    resumeUrl: uploadPdf?.url,
                },
                {
                    timeout: 120000,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const questionsText =
                result.data.candidates[0].content.parts[0].text;
            const interviewQuestions = JSON.parse(questionsText);

            return NextResponse.json(
                {
                    url: uploadPdf.url,
                    interviewQuestions: interviewQuestions, // Clean array of questions
                    metadata: {
                        modelVersion: result.data.modelVersion,
                        totalTokens: result.data.usageMetadata?.totalTokenCount,
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

            // Return success with file URL but note webhook failure
            return NextResponse.json(
                {
                    url: uploadPdf.url,
                    warning:
                        "File uploaded successfully but webhook processing failed",
                    error: webhookError.message,
                },
                { status: 200 }
            );
        }
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            {
                error: "File upload failed",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
