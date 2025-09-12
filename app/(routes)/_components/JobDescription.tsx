import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function JobDescription({onChange}:any) {

    return (
        <div className="border rounded-2xl p-10">
            <div>
                <label htmlFor="">Job Title</label>
                <Input placeholder="Ex. Full Stack React Developer" onChange={(event) => onChange("jobTitle", event.target.value)} />
            </div>
            <div className="mt-6">
                <label htmlFor="">Job Description</label>
                <Textarea  placeholder="Enter or paste your job description here" className="h-[200px]" onChange={(event) => onChange("jobDescription", event.target.value)} />
            </div>
        </div>
    );
}

export default JobDescription;
