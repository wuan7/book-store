"use client";

import React, { useEffect, useState } from "react";
import { getProductsWithPagination } from "../actions/product";
import Image from "next/image";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { ProductWithExtra } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getCategories } from "../actions/category";
import { Category } from "../lib/generated/prisma";
import { Loader } from "lucide-react";

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={12} className="text-yellow-400" />);
    } else if (rating >= i - 0.5) {
      stars.push(
        <FaStarHalfAlt key={i} size={12} className="text-yellow-400" />
      );
    } else {
      stars.push(<FaRegStar key={i} size={12} className="text-yellow-400" />);
    }
  }
  return stars;
};

const ProductList = () => {
  const [books, setBooks] = useState<ProductWithExtra[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("default");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const { products, totalPages } = await getProductsWithPagination(
          page,
          10,
          sort,
          category
        );
        setBooks(products);
        setTotalPages(totalPages);
      } catch (error) {
        console.error(error);
      }finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [page, sort, category]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);
  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1); // Reset lại trang về 1 khi thay đổi cách sắp xếp
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1); // Reset lại trang về 1 khi thay đổi cách sắp xếp
  };
  return (
    <>
      <div className="bg-white my-5 flex md:flex-row flex-col md:items-center gap-y-2 md:gap-0 justify-between p-3 dark:bg-[#0f0f0f] dark:shadow-sm dark:shadow-white/10">
        <h1 className="text-sm">Sắp xếp sách</h1>
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
                <SelectItem value="new">Sách mới</SelectItem>
                <SelectItem value="bestSelling">Bán chạy</SelectItem>
                <SelectItem value="desc">Giá cao - thấp</SelectItem>
                <SelectItem value="asc">Giá thấp - cao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mb-8">
        {isLoading ? (
          <div className="flex items-center flex-col justify-center col-span-full py-10 max-w-7xl mx-auto">
            <Loader className="animate-spin text-primary" />
        </div>
        ) : books.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10 text-sm font-bold">
          Không tìm thấy sản phẩm phù hợp.
        </div>
        ) : books.map((book) => (
          <Link key={book.id} href={`/books/${book.slug}`}>
            <div className="h-full rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 hover:scale-[1.02] bg-white dark:bg-[#0f0f0f] dark:shadow-sm dark:shadow-white/10 cursor-pointer">
              <div className="relative w-full h-44 mb-3">
                <Image
                  src={book.imageUrl}
                  alt={book.name}
                  fill
                  className="object-contain rounded-t-lg"
                />
              </div>
              <div className="p-3 space-y-2">
                <div className="flex gap-x-3 items-center">
                  <p className="text-red-500 font-bold relative text-sm">
                    {book.discount && book.discount > 0
                      ? (
                          book.price *
                          (1 - book.discount / 100)
                        ).toLocaleString()
                      : book.price.toLocaleString()}
                    <span className="text-xs absolute -top-0.5 underline">
                      đ
                    </span>
                  </p>
                  {book.discount && book.discount > 0 ? (
                    <div className="py-0.5 px-2 rounded text-xs font-semibold bg-red-100 text-red-500 dark:bg-red-500/20 dark:text-red-400">
                      -{book.discount}%
                    </div>
                  ) : null}
                </div>
                {book.discount && book.discount > 0 ? (
                  <p className="text-gray-400 text-xs line-through relative dark:text-gray-500">
                    {book.price.toLocaleString()}
                    <span className="text-xs absolute -top-0.5 underline">
                      đ
                    </span>
                  </p>
                ) : null}

                <h2 className="text-gray-500 uppercase text-xs dark:text-gray-400">
                  {book.author}
                </h2>
                <h1 className="font-semibold text-sm capitalize text-black dark:text-white line-clamp-2">
                  {book.name}
                </h1>

                <div className="flex items-center justify-between">
                  {book.averageRating ? (
                    <div className="flex gap-x-0.5">
                      {renderStars(book.averageRating)}
                    </div>
                  ) : null}
                  {book.totalSold ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Đã bán {book.totalSold}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </Link>
        ))}
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
    </>
  );
};

export default ProductList;
