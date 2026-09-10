"use client";

import { clsx } from "clsx";
import Image from "next/image";
import brand from "../../public/mark.svg";
import useAppStore from "../helpers/store";

const Brand = () => {
  const { isDebug } = useAppStore((state) => state);
  return (
    <div className="relative z-10 flex items-center">
      <Image alt="Mapshaver Logo" src={brand} className="mr-2 w-4" />
      <h1 className={clsx("font-display text-lg", isDebug && "text-blue-600")}>
        Mapshaver
      </h1>
    </div>
  );
};

export default Brand;
