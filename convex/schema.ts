import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable: defineTable({
        name: v.string(),
        imageUrl: v.string(),
        email: v.string(),
    }),
    
    InterviewSessionTable: defineTable({
        interviewQuestions: v.any(),
        resumeUrl: v.optional(v.string()),
        userId: v.id("UserTable"),
        status: v.string(),
        jobTitle: v.optional(v.string()),
        jobDescription: v.optional(v.string()),

    }),
});
