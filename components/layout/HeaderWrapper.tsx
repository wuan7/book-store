"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";

const HeaderWrapper = () => {
  const pathname = usePathname();
  const noHeaderPaths = ["/admin"];
  if (noHeaderPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <>
      <Header />
    </>
  )
};

export default HeaderWrapper;