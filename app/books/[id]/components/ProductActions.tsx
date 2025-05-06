"use client";

import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { toast } from "react-toastify";
import { cartItemCountAtom } from "../../../../atoms/cartAtom";
import { useAtom } from "jotai";
import { getCartByUser } from "../../../../actions/cart";
import { ProductWithExtra } from "../../../../types";
interface ProductActionsProps {
  book: ProductWithExtra;
}
export default function ProductActions({ book }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [, setCartItemCount] = useAtom(cartItemCountAtom);
  const [isLoading, setIsLoading] = useState(false);
  const handleIncrease = () => {
    const bookQuantity = book.stock - book.reserved;
    if (quantity < bookQuantity) {
      setQuantity((pre) => pre + 1);
    } else {
      toast.error("Số lượng sản phẩm không đủ");
    }
  };
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleBuyNow = async () => {
    const data = [
      {
        productId: book.id,
        quantity: quantity,
      },
    ];
    const priceAfterDiscount = book.discount
      ? book.price * (1 - book.discount / 100)
      : book.price;
    try {
      setIsLoading(true);
      const res = await fetch("/api/order/create", {
        method: "POST",
        body: JSON.stringify({
          items: data,
        }),
      });
      if (!res.ok) {
        toast.error("có lỗi0");
        return;
      }

      const orderData = await res.json();
      const paymentData = {
        bookingId: orderData.order.id,
        amount: priceAfterDiscount,
      };
      const response = await fetch("/api/vnpay/create-payment-url", {
        method: "POST",
        body: JSON.stringify(paymentData),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
      toast.success("Đang điều hướng qua trang thanh toán, xin vui lòng chờ");
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const data = {
      productId: book.id,
      quantity: quantity,
    };
    try {
     setIsLoading(true);
      const res = await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        toast.error("Có lỗi khi thêm sách vào giỏ hàng");
        setIsLoading(false);
        return;

      }
      toast.success("Đã thêm vào giỏ hàng!");
      setIsLoading(false);
      
      const cartRes = await getCartByUser();
      setCartItemCount(cartRes.cartItems.length);
    } catch (error) {
      console.log(error);
    } 
  };
  return (
    <div className="bg-white p-4 rounded-md shadow-md dark:bg-[#0f0f0f]  dark:shadow-white/10 space-y-4 w-full ">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Số lượng</p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrease}
            disabled={quantity === 1}
            className="cursor-pointer"
          >
            -
          </Button>
          <p className="text-base font-semibold w-6 text-center cursor-default">
            {quantity}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrease}
            disabled={quantity === book.stock - book.reserved}
            className="cursor-pointer"
          >
            +
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {book.stock - book.reserved} sản phẩm có sẵn
        </p>
      </div>

      {/* Hành động */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          onClick={handleBuyNow}
          disabled={isLoading}
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}
