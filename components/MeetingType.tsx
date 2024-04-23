"use client";

import React, { useState } from "react";
import { homeCards } from "@/constants/homecards";
import HomeCard from "@/components/HomeCard";
import MeetingModal from "@/components/MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";

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

  const meetingLink = `${process.env.NEXT_PUBLIC_APP_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {homeCards.map((list, index) => {
        return (
          <HomeCard
            key={list.src}
            index={index}
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

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingType === "isScheduledMeeting"}
          onClose={() => setMeetingType(undefined)}
          title="Create a Meeting"
          className="text-center"
          buttonText="Create"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading=-[22px] text-sky-1">
              Add a Description
            </label>
            <Textarea
              className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            ></Textarea>
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-1">
              Select Date And Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="HH:mm"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-1 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingType === "isScheduledMeeting"}
          onClose={() => setMeetingType(undefined)}
          title="Meeting is created"
          className="text-center"
          buttonText="Copy the Meeting Link"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}
      <MeetingModal
        isOpen={meetingType === "isInstantMeeting"}
        onClose={() => setMeetingType(undefined)}
        title="Start An Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingType === "isJoiningMeeting"}
        onClose={() => setMeetingType(undefined)}
        title="Type The Link Here"
        className="text-center"
        buttonText="Join the Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="meeting Link"
          className="border-none bg-dark-1 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingType;
