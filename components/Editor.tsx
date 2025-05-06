"use client";
import { useState } from "react";
import TiptapEditor from "../components/editor/TiptapEditor";
import CreatePost from "../components/modals/CreatePost";
import { useAdminModal } from "../hooks/useAdminModal";

const Editor = () => {
  const { openCreatePost } = useAdminModal();
  const [content, setContent] = useState("");
  const handleSubmit = async () => {
    openCreatePost();
  };

  return (
    <>
      <CreatePost content={content}/>

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-semibold">Tạo bài viết</h1>

        <TiptapEditor onChange={setContent} />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Đăng bài
        </button>
      </div>
    </>
  );
};

export default Editor;