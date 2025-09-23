import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Send } from "lucide-react";
import React from "react";

function page() {
    return (
        <div className="flex justify-center items-center  mt-24">
            <div className="flex flex-col items-center space-y-5  p-10 ">
                <h2 className="text-3xl font-bold text-center">
                    Ready to Start the Interview?
                </h2>
                <p className="text-center text-gray-500">
                    Interview will last in 30 minutes. Are you ready to start?
                </p>
                <Button>
                    Start Interview
                    <ArrowRight />
                </Button>

                <hr className="w-full border-gray-300" />
                <h2>Want to send interview link to someone else?</h2>
                <div className="flex gap-5 w-full max-w-2xl">
                    <Input
                        placeholder="Enter email address"
                        className="w-full"
                    />
                    <Button>
                        <Send />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default page;
