"use client";
import React from "react";
import { useAdminModal } from "../../../../../hooks/useAdminModal";
import { Button } from "../../../../../components/ui/button";

const AddImagePage = () => {
  const { openCreateImage } = useAdminModal();
  return (
    <div className="m-4">
      <Button onClick={openCreateImage}>Tạo ảnh cho sách</Button>
    </div>
  );
};

export default AddImagePage;
