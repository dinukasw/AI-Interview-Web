import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        imageUrl: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        //if user already exist
        const user = await ctx.db
            .query("UserTable")
            .filter((q) => q.eq(q.field("email"), args.email))
            .collect();

        //if not insert new user to DB
        if (user?.length === 0) {
            const data = {
                name: args.name,
                imageUrl: args.imageUrl,
                email: args.email,
            };
            const result = await ctx.db.insert("UserTable", { ...data });

            return {
                ...data,
                result
                // _id: result._id
            };
        }

        return user[0];
    },
});
