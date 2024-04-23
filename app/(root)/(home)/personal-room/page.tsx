"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useGetCallById } from "@/hooks/usegetCallById";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";

const PersonalRoomPage = () => {
  const { user } = useUser();

  const router = useRouter();
  const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${user?.id}?personal=true`;

  const { call } = useGetCallById(user?.id!);

  const client = useStreamVideoClient();
  const Table = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    return (
      <div className="flex flex-col items-start gap-2 xl:flex-row">
        <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
          {title}
        </h1>
        <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
          {description}
        </h1>
      </div>
    );
  };

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", user.id!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${user.id!}?personal=true`);
  };

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Personal Rooms</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
        <Table title="Meeting ID" description={user?.id!} />
        <Table title="Invite Link" description={meetingLink!} />

        <div className="flex gap-5">
          <Button className="bg-blue-1" onClick={startRoom}>
            Start Meeting
          </Button>
          <Button
            className="bg-dark-1"
            onClick={() => {
              navigator.clipboard.writeText(meetingLink);
              toast({
                title: "Link Copied!",
              });
            }}
          >
            Copy Link
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PersonalRoomPage;
