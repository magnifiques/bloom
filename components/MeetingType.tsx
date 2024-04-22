"use client";

import React, { useState } from "react";
import { homeCards } from "@/constants/homecards";
import HomeCard from "@/components/HomeCard";
import MeetingModal from "@/components/MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const MeetingType = () => {
  const router = useRouter();

  const { toast } = useToast();
  const [meetingType, setMeetingType] = useState<
    "isScheduledMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const { user } = useUser();

  const client = useStreamVideoClient();

  console.log(meetingType);
  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select date and Time",
        });
        return;
      }
      const id = crypto.randomUUID();

      const call = client.call("default", id);

      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      toast({
        title: "Meeting has been successfully created",
      });

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed To Create a Meeting",
      });
    }
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {homeCards.map((list) => {
        return (
          <HomeCard
            key={list.src}
            title={list.title}
            subtitle={list.subtitle}
            src={list.src}
            className={list.className}
            handleClick={() =>
              setMeetingType(
                list.state as
                  | "isScheduledMeeting"
                  | "isJoiningMeeting"
                  | "isInstantMeeting"
                  | undefined
              )
            }
          />
        );
      })}
      <MeetingModal
        isOpen={meetingType === "isInstantMeeting"}
        onClose={() => setMeetingType(undefined)}
        title="Start An Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingType;
