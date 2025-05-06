"use client";

import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { cn } from "../../../../lib/utils";
import { getReviewsByProductId } from "../../../../actions/review";
import { ReviewWithUser } from "../../../../types";
import { handleUploadImage } from "../../../../utils/uploadImage";
import ImageUpload from "../../../../components/ImageUpload";
import { toast } from "react-toastify";
interface ProductActionsProps {
  bookId: string;
}

const ProductReviews = ({ bookId }: ProductActionsProps) => {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isCanComment, setIsCanComment] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async () => {
    const reviews = await getReviewsByProductId(bookId);
    console.log("reviews", reviews);
    setReviews(reviews);
  };
  useEffect(() => {
    const checkCanComment = async () => {
      const response = await fetch("/api/review/can-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: bookId }),
      });
      const data = await response.json();
      setIsCanComment(data.allowed);
    };
    checkCanComment();

    
    fetchReviews();
  }, [bookId]);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return;
    let uploadedImage: { url: string; publicId: string } | undefined;
    if (files.length > 0) {
      uploadedImage = await handleUploadImage(files, setIsLoading);
    }
    try {
      setIsLoading(true);
      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: bookId,
          rating,
          comment,
          imageUrl: uploadedImage?.url,
          imagePublicId: uploadedImage?.publicId,
        }),
      });
      if (!res.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
      toast.success("Đã gửi!");
      fetchReviews();
      setRating(0);
      setComment("");
      setFiles([]);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
    
  };

  const getStarStats = (star: number) =>
    reviews.filter((r) => r.rating === star).length;

  const averageRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  return (
    <div className="space-y-4 bg-white dark:bg-[#0f0f0f] p-4 rounded-md">
      {/* Tổng quan sao */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Đánh giá sản phẩm</h2>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {averageRating.toFixed(1)}
            </p>
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={18}
                  className={cn(
                    "text-gray-300",
                    averageRating > i && "text-yellow-500"
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {reviews.length} lượt đánh giá
            </p>
          </div>
          <div className="flex flex-col gap-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <p className="w-8">{star}★</p>
                <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-yellow-400"
                    style={{
                      width: `${
                        (getStarStats(star) / reviews.length) * 100 || 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p>({getStarStats(star)})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isCanComment ? (
        <>
          {/* Gửi đánh giá mới */}
          <div className="space-y-2 border-t border-gray-200 pt-4">
            <h3 className="text-base font-semibold">Thêm đánh giá của bạn</h3>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={20}
                  className={cn(
                    "cursor-pointer",
                    (hoverRating || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  )}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <Textarea
              placeholder="Hãy chia sẻ cảm nhận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <ImageUpload
              files={files}
              setFiles={setFiles}
              loading={isLoading}
            />

            <Button onClick={handleSubmit} disabled={isLoading} >Gửi đánh giá</Button>
          </div>
        </>
      ) : (
        <div className="text-sm">
          Bạn không thể bình luận nếu chưa mua sản phẩm này
        </div>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4 border-t border-gray-200 pt-4">
          {reviews.map((r) => (
            <div key={r.id} className="space-y-1 border-b pb-4">
              <div className="flex items-center gap-2">
                <Image
                  src={r.user.imageUrl || "default-avatar.png"}
                  alt={r.user.name || "Anonymous"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-sm">{r.user.name}</p>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={12}
                        className={
                          i < r.rating ? "text-yellow-400" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {r.comment}
              </p>
              {r.imageUrl && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Image
                    src={r.imageUrl}
                    alt={`review-img`}
                    width={100}
                    height={100}
                    className="rounded object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm font-semibold">Không có bình luận</div>
      )}
    </div>
  );
};

export default ProductReviews;
