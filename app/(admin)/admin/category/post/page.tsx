"use client";
import React from "react";
import { useAdminModal } from "../../../../../hooks/useAdminModal";
import { Button } from "../../../../../components/ui/button";
const PostPage = () => {
  const { openCreatePostCategory } = useAdminModal();
  return (
    <div className="m-4">
      <Button onClick={openCreatePostCategory}>Tạo Danh mục cho bài viết</Button>
    </div>
  );
};

export default PostPage;
