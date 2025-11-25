import React from "react";
import { Spinner } from "@/components/ui/spinner";

const LoadingScreen: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#00000] text-white">
      <Spinner className="size-12 mb-4" />
      <span className="text-2xl font-semibold">Loading...</span>
    </div>
  );
};

export default LoadingScreen;