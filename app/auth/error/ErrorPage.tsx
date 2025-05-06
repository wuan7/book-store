"use client";
import React from 'react'
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  Configuration: "Có vấn đề với cấu hình máy chủ. Kiểm tra lại cài đặt.",
  AccessDenied: "Bạn không có quyền truy cập.",
  Verification: "Liên kết xác minh đã hết hạn hoặc đã được sử dụng.",
  Default: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
};

const ErrorPage = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get("error") || "Default";
    const errorMessage = errorMessages[error] || errorMessages["Default"];
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-500">Lỗi Xác Thực</h1>
          <p className="mt-2 text-gray-700">{errorMessage}</p>
        </div>
      </div>
    );
}

export default ErrorPage