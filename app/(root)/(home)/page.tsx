"use client";
import MeetingType from "@/components/MeetingType";
import React from "react";

const Home = () => {
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

      <MeetingType />
    </section>
  );
};

export default Home;
