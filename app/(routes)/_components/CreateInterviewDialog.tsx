import React, { useContext, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResumeUpload from "./ResumeUpload";
import JobDescription from "./JobDescription";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";

function CreateInterviewDialog() {
    const [formData, setFormData] = useState<any>({
        resume: null,
        jobTitle: "",
        jobDescription: "",
    });
    const [file, setFile] = useState<File | null>();
    const [loading, setLoading] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const saveInterviewQuestion = useMutation(
        api.Interview.SaveInterviewQuestion
    );

    const onSubmit = async () => {
        setLoading(true);
        const formData_ = new FormData();
        if (file) {
            formData_.append("file", file);
        }
        formData_.append("jobTitle", formData.jobTitle);
        formData_.append("jobDescription", formData.jobDescription);

        try {
            const res = await axios.post(
                "/api/generate-interview-questions",
                formData_
            );
            console.log(res.data);


            if(res?.data?.status === 409){
                console.log(res?.data?.result);
                
            }

            //save to db
            const response = await saveInterviewQuestion({
                questions: res?.data.interviewQuestions,
                resumeUrl: res.data.url,
                uid: userDetail?._id,
                jobTitle: formData?.jobTitle,
                jobDescription: formData?.jobDescription,
            });

            console.log("Interview saved successfully:", response);
        } catch (error: any) {
            console.error(
                "Upload failed:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const onHandleInputChange = (field: string, value: string) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [field]: value,
        }));
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"lg"}>+ Create Interview</Button>
            </DialogTrigger>
            <DialogContent className="min-w-3xl">
                <DialogHeader>
                    <DialogTitle>Please Submit Following Details</DialogTitle>
                    <DialogDescription>
                        <Tabs
                            defaultValue="resume-upload"
                            className="w-full mt-5"
                        >
                            <TabsList>
                                <TabsTrigger value="resume-upload">
                                    Resume Upload
                                </TabsTrigger>
                                <TabsTrigger value="job-description">
                                    Job Description
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="resume-upload">
                                <ResumeUpload
                                    setFiles={(file: any) => setFile(file)}
                                />
                            </TabsContent>
                            <TabsContent value="job-description">
                                <JobDescription
                                    onChange={onHandleInputChange}
                                />
                            </TabsContent>
                        </Tabs>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-6">
                    <DialogClose>
                        <Button variant={"ghost"}>Cancle</Button>
                    </DialogClose>
                    <Button
                        onClick={onSubmit}
                        disabled={
                            loading ||
                            (!file &&
                                (!formData.jobTitle ||
                                    !formData.jobDescription))
                        }
                    >
                        {loading && <Loader2Icon className="animate-spin" />}
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CreateInterviewDialog;
