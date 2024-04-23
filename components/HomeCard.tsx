import React from "react";
import { HomeCardType } from "@/types/types";

import Image from "next/image";
import { cn } from "@/lib/utils";

const backgroundColor = [
  "px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer bg-orange-1",
  "px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer bg-blue-1",
  "px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer bg-purple-1",
  "px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer bg-yellow-1",
];

const HomeCard = ({
  title,
  subtitle,
  src,
  className,
  index,
  handleClick,
}: HomeCardType) => {
  return (
    <div className={backgroundColor[index]} onClick={() => handleClick()}>
      <div className="flex-center glassmorphism size-12 rounded-[12px]">
        <Image src={src} alt="add Meeting Icon" width={27} height={27} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{subtitle}</p>
      </div>
    </div>
  );
};

export default HomeCard;
