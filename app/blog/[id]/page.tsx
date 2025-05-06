"use client";

import { ArticleWithPostCateGory } from "../../../types";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostById } from "../../../actions/post";
import { Loader } from "lucide-react";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<ArticleWithPostCateGory>();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const data = await getPostById(id as string);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto h-[80vh] px-4 py-8 text-center font-bold">
        Không tìm thấy bài viết
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg mb-8">
        <Image
          src={post.imageUrl || ""}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {post.title}
      </h1>

      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
        <span>
          {new Date(post.createdAt).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span className="mx-2">•</span>
        <span>Admin</span>
        <span className="mx-2">•</span>
        <span>{post.readingTime} phút đọc</span>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-gray-800 dark:text-gray-300 space-y-1.5">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default BlogDetailPage;
