"use client";
import React, { useState } from "react";
import { homeCards } from "@/constants/homecards";
import HomeCard from "@/components/HomeCard";
import MeetingModal from "@/components/MeetingModal";

const Home = () => {
  const [meetingType, setMeetingType] = useState<
    "isScheduledMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();

  const createMeeting = () => {};
  const date = new Date();

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const day = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
    weekday: "long",
  });

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
            Upcoming Meeting at: 2:00 PM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{day}</p>
          </div>
        </div>
      </div>
      {homeCards.map((list) => {
        return (
          <HomeCard
            key={list.src}
            title={list.title}
            subtitle={list.subtitle}
            src={list.src}
            bgColor={list.bgColor}
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

export default Home;
