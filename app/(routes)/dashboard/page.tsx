"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import EmptyState from "./EmptyState";

function Dashboard() {
    const { user } = useUser();
    const [InterviewList, setInterviewList] = React.useState([]);

    return (
        <div className="py-2 px-10 md:px-28 lg:px-44 xl:px-56">
            <div className="flex justify-between items-center">
              <div>
                  <h2 className="text-lg text-gray-500">My Dashboard</h2>
                  <h2 className="text-3xl font-bold">
                      Welcome, {user?.firstName}
                  </h2>
              </div>
              <Button size={"lg"}>+ Create Interview</Button>
            </div>
            {InterviewList.length === 0 ? (
              <EmptyState />
            ) : (
              <div>
                {/* {InterviewList.map((interview) => (
                  <div key={interview.id}>{interview.title}</div>
                ))} */}
              </div>
            )}
        </div>
    );
}

export default Dashboard;
