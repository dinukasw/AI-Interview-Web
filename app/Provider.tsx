"use client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useState } from "react";

function Provider({ children }: any) {
    const { user } = useUser();
    const CreateUser = useMutation(api.users.CreateNewUser);
    const [userDetail, setUserDetail] = useState<any>(null);

    useEffect(() => {
        user && CreateNewUser();
    }, [user]);

    const CreateNewUser = async () => {
        if (user) {
            const result = await CreateUser({
                email: user?.primaryEmailAddress?.emailAddress || "",
                imageUrl: user?.imageUrl,
                name: user?.fullName || "",
            });

            console.log(result);
            setUserDetail(result);

        }
    };
    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            {children}
        </UserDetailContext.Provider>
    );
}

export default Provider;

