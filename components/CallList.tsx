//@ts-nocheck
"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { toast } from "./ui/use-toast";

const CallList = ({
  type,
}: {
  type: "upcoming" | "previous" | "recordings";
}) => {
  const { upcomingCalls, previousCalls, isLoading, callRecordings } =
    useGetCalls();

  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings())
        );

        const recordings = callData
          .filter((recording) => recording.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({
          title: "Please Try Again Later",
        });
      }
    };
    if (type === "recordings") fetchRecordings();
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const getCalls = () => {
    switch (type) {
      case "upcoming":
        return upcomingCalls;
      case "previous":
        return previousCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };

  const getNoCalls = () => {
    switch (type) {
      case "upcoming":
        return "No Upcoming Calls Found";
      case "previous":
        return "No Previous Calls Found";
      case "recordings":
        return "No Recordings Found";
      default:
        return "";
    }
  };

  const calls = getCalls();
  const noCallsMessage = getNoCalls();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            title={
              (meeting as Call).state?.custom.description ||
              meeting.filename.substring(0, 26) ||
              "No Description"
            }
            date={
              (meeting as Call).state.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocalString()
            }
            isPreviousMeeting={type === "previous"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            buttonText={type === "recordings" ? "Play" : "Join"}
            handleClick={
              type === "recordings"
                ? () => router.push(`${meeting.url}`)
                : () => router.push(`/meeting/${meeting.id}`)
            }
            link={
              type === "recordings"
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
            }
            icon={
              type === "previous"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recording.svg"
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
