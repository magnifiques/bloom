import React from "react";
import { HomeCardType } from "@/types/types";

import Image from "next/image";
import { cn } from "@/lib/utils";

const HomeCard = ({
  title,
  subtitle,
  src,
  bgColor,
  handleClick,
}: HomeCardType) => {
  return (
    <div
      className={`bg-${bgColor}-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer`}
      onClick={() => handleClick()}
    >
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
