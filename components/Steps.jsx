import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";

const Steps = () => {
  return (
    <div className="flex items-center flex-col gap-10 text-center my-5">
      <h2 className="text-4xl px-40 font-medium">
        Free Invoice Generator (Add invoice details and download it in PDF
        format.)
      </h2>

      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          <p className="border-2 rounded-full w-5 h-5 flex justify-center items-center text-[12px]">
            1
          </p>
          <p className="text-lg">Invoice Details</p>
          <div className="px-1 text-slate-400 text-[18px]">
            <MdKeyboardArrowRight />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="border-2 rounded-full w-5 h-5 flex justify-center items-center text-[12px]">
            2
          </p>
          <p className="text-lg">Design & Share (optional)</p>
          <div className="text-slate-400 text-[18px]">
            <CiCircleInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steps;
