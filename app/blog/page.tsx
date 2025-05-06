"use client";

import {
  getPostCategoriesWithPagination,
  getPostCategories,
} from "../.././actions/post";
import { ArticleWithPostCateGory } from "../.././types";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../.././components/ui/select";
import { PostCategory } from "../.././lib/generated/prisma";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../.././components/ui/pagination";
const BlogPage = () => {
  const [posts, setPosts] = useState<ArticleWithPostCateGory[]>([]);
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("default");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsData, categoriesData] = await Promise.all([
          getPostCategoriesWithPagination(page, 10, sort, category),
          getPostCategories(),
        ]);
        setPosts(postsData.posts);
        setTotalPages(postsData.totalPages);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, sort, category]);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1); // Reset lại trang về 1 khi thay đổi cách sắp xếp
  };
  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1); // Reset lại trang về 1 khi thay đổi cách sắp xếp
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Bài viết
      </h1>
      <div className="bg-white my-5 flex md:flex-row flex-col md:items-center gap-y-2 md:gap-0 justify-between p-3 dark:bg-[#0f0f0f] dark:shadow-sm dark:shadow-white/10">
        <h1 className="text-sm">Sắp xếp bài viết</h1>
        <div className="flex gap-x-2">
          <div>
            <Select
              defaultValue={category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              defaultValue={sort}
              value={sort}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="desc">Bài viết mới nhất</SelectItem>
                <SelectItem value="asc">Bài viết cuối nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {isLoading ? (
          <div className="flex items-center flex-col justify-center col-span-full py-10 max-w-7xl mx-auto">
            <Loader className="animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10 text-sm font-bold">
            Không tìm thấy bài viết phù hợp.
          </div>
        ) : (
          posts.map((post) => (
            <Link className="" key={post.id} href={`/blog/${post.slug}`}>
              <div className="bg-white h-full dark:bg-gray-900 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                <div className="relative w-full h-32">
                  <Image
                    src={post.imageUrl || ""}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                  </p>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {post.postCategory.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {post.readingTime} phút đọc
                  </p>
                  <div>
                    <button className="mt-2 text-indigo-600 dark:text-indigo-400 font-medium text-xs hover:underline cursor-pointer">
                      Đọc tiếp →
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <PaginationItem key={idx}>
                <PaginationLink
                  href="#"
                  isActive={page === idx + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(idx + 1);
                  }}
                >
                  {idx + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BlogPage;
