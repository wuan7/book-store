"use client";
import { useEffect, useState } from "react";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import CreateCategory from "./modals/CreateCategory";
import CreateProduct from "./modals/CreateProduct";
import CreateImage from "./modals/CreateImage";
import CreatePostCategory from "./modals/CreatePostCategory";
const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <SignIn />
      <SignUp />
      <CreateCategory />
      <CreateProduct />
      <CreateImage />
      <CreatePostCategory />
    </>
  );
};

export default Modals;