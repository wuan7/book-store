"use client";

import BookCarousel from "../../../components/carousel/BookCarousel";
import { EmblaOptionsType } from "embla-carousel";
import { FaStar } from "react-icons/fa";
import { useParams } from "next/navigation";
import ProductActions from "./components/ProductActions";
import ProductDescription from "./components/ProductDescription";
import ProductReviews from "./components/ProductReviews";
import { useEffect, useState } from "react";
import { getProduct } from "../../../actions/product";
import { Loader } from "lucide-react";
import { ProductWithExtra } from "../../../types";

const OPTIONS: EmblaOptionsType = {};

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<ProductWithExtra | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchdBook = async () => {
      try {
        setIsLoading(true);
        const tourData = await getProduct(id as string);
        setBook(tourData);
        console.log("Book Data", tourData);
      } catch (error) {
        console.error("Error fetching book id:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchdBook();
  }, [id]);

  if(isLoading || !book) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader className="size-6 animate-spin"/>
      </div>
  
    )
  }
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 p-4 max-w-5xl mx-auto items-start">
        {/* Left - Image section */}
        <div className="w-full lg:w-1/3 bg-white dark:bg-[#0f0f0f] p-2">
          <BookCarousel options={OPTIONS} bookId={book.id}/>
        </div>

        {/* Right - Book details */}
        <div className="w-full lg:w-2/3 space-y-4">
          <div className="space-y-2 bg-white dark:bg-[#0f0f0f] dark:shadow-sm dark:shadow-white/10 p-2 rounded-md">
            <h1 className="text-xl font-semibold ">{book.name}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Tác giả: <span className="text-sky-600">{book.author}</span>
            </p>
            <div className="flex gap-x-2 items-center">
              <div className="flex gap-x-2 items-center cursor-pointer">
                <p className="font-semibold text-sm">{book.averageRating}</p>
                <div className="flex gap-x-0.5">
                  <FaStar size={12} className="text-yellow-400" />
                  <FaStar size={12} className="text-yellow-400" />
                  <FaStar size={12} className="text-yellow-400" />
                  <FaStar size={12} className="text-yellow-400" />
                  <FaStar size={12} className="text-yellow-400" />
                </div>
                <p className="text-sm text-gray-500">({book.reviews.length})</p>
              </div>
              <span className="text-gray-500 font-light text-sm">|</span>
              <p className="text-sm text-gray-500">Đã bán {book.totalSold ? book.totalSold : 0}</p>
            </div>
            <div className="flex gap-x-3 items-center">
              {book.discount && book.discount > 0 ? (
                <>
                  <p className="text-red-500 font-semibold relative text-2xl">
                { (book.price * (1 - book.discount / 100)).toLocaleString()}
                <span className="text-xs absolute -top-0.5 underline">đ</span>
              </p>
              <div className="py-0.5 px-2 rounded text-xs font-semibold bg-red-100 text-red-500 dark:bg-red-500/20 dark:text-red-400">
                -{book.discount}%
              </div>
              <p className="line-through text-gray-400  relative text-sm">
                {book.price.toLocaleString()}
                <span className="text-xs absolute -top-0.5 underline">đ</span>
              </p>
                </>
              ) : (
                <p className="text-red-500 font-semibold relative text-2xl">
                {book.price.toLocaleString()}
                <span className="text-xs absolute -top-0.5 underline">đ</span>
              </p>
              )}
              
            </div>
          </div>
          <ProductActions book={book}/>
          <ProductDescription description={book.description} />
        </div>
      </div>
      <div className="p-4 max-w-5xl mx-auto">
        <ProductReviews bookId={book.id}/>
      </div>
    </>
  );
};

export default BookPage;
