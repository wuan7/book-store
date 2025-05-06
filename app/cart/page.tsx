"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../.././components/ui/button";
import { Checkbox } from "../.././components/ui/checkbox";
import { Input } from "../.././components/ui/input";
import { getCartByUser } from "../.././actions/cart";
import { CartWithCartItemsAndProducts } from "../.././types";
import { Product } from "../.././lib/generated/prisma";
import { cartItemCountAtom } from "../.././atoms/cartAtom";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<
    (CartWithCartItemsAndProducts["cartItems"][number] & {
      selected?: boolean;
    })[]
  >([]);
  const [, setCartItemCount] = useAtom(cartItemCountAtom);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      const cart = await getCartByUser();
      if (!cart || !cart.cartItems) {
        setIsLoading(false);
        return;
      }

      // Gán selected mặc định là true cho mỗi item
      const initializedItems = cart.cartItems.map((item: Product) => ({
        ...item,
        selected: true,
      }));
      console.log("cart", cart);
      console.log("initializedItems", initializedItems);
      setCartItems(initializedItems);
      setIsLoading(false);
    };
    fetchCart();
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (newQuantity > item.product.stock) {
      toast.error("Số lượng vượt quá tồn kho!");
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(
                  newQuantity,
                  item.product.stock - item.product.reserved
                )
              ),
            }
          : item
      )
    );
  };

  const changeQuantityBy = async (id: string, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    updateQuantity(id, item.quantity + delta);
    const data = {
      cartItemId: id,
      quantity: delta,
    };
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        toast.error("Có lỗi khi cập nhật số lượng giỏ hàng");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectItem = (id: string, selected: boolean) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected } : item))
    );
  };

  const handleDeleteItem = async (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setCartItemCount((prev) => prev - 1);
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    const data = {
      cartItemId: id,
    };
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        toast.error("Có lỗi khi xóa sách trong giỏ hàng");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = (selected: boolean) => {
    setCartItems((prev) => prev.map((item) => ({ ...item, selected })));
    toast.info(`Đã ${selected ? "chọn" : "bỏ chọn"} tất cả sản phẩm`);
  };

  const selectedItems = cartItems.filter((item) => item.selected);
  const total = selectedItems.reduce((sum, item) => {
    const priceAfterDiscount = item.product.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;

    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  const handleBuy = async () => {
    console.log("Mua hàng", selectedItems);

    try {
      setIsLoading(true);
      const res = await fetch("/api/order/create", {
        method: "POST",
        body: JSON.stringify({
          items: selectedItems,
          type: "BUY",
        }),
      });
      if (!res.ok) {
        toast.error("có lỗi");
        return;
      }

      const orderData = await res.json();
      const paymentData = {
        bookingId: orderData.order.id,
        amount: total,
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
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6 ">
        <Image
          src="/empty-cart.png"
          alt="Giỏ hàng trống"
          width={400}
          height={400}
          className="mx-auto rounded-md"
        />
        <h2 className="text-2xl font-semibold ">Giỏ hàng của bạn đang trống</h2>
        <p className="">Hãy tiếp tục mua sắm và thêm sản phẩm vào giỏ hàng.</p>
        <Button
          className="px-6 py-2 bg-primary   cursor-pointer"
          onClick={() => router.push("/")}
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Giỏ hàng</h1>

      {/* Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium border-b pb-2">
        <div className="col-span-6 flex items-center gap-2">
          <Checkbox
            checked={
              cartItems.length > 0 && cartItems.every((item) => item.selected)
            }
            onCheckedChange={(checked) => handleSelectAll(!!checked)}
          />
          <span>Sản phẩm</span>
        </div>
        <div className="col-span-2">Đơn giá</div>
        <div className="col-span-2">Số lượng</div>
        <div className="col-span-1">Thành tiền</div>
        <div className="col-span-1"></div>
      </div>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 border-b py-4 text-sm"
        >
          <div className="sm:col-span-6 flex items-center gap-2">
            <Checkbox
              checked={item.selected}
              onCheckedChange={(checked) =>
                handleSelectItem(item.id, !!checked)
              }
            />
            <Image
              src={item.product.imageUrl}
              alt={item.product.name}
              width={60}
              height={60}
              className="rounded border"
            />
            <span className="font-medium">{item.product.name}</span>
          </div>

          <div className="sm:col-span-2 text-gray-700">
            {item.product.discount && item.product.discount > 0
              ? (
                  item.product.price *
                  (1 - item.product.discount / 100)
                ).toLocaleString()
              : item.product.price.toLocaleString()}
          </div>

          <div className="sm:col-span-2 flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeQuantityBy(item.id, -1)}
            >
              -
            </Button>
            <Input
              type="number"
              className="w-12 text-center"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  updateQuantity(item.id, value);
                }
              }}
              min={1}
              max={item.product.stock - item.product.reserved}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeQuantityBy(item.id, 1)}
            >
              +
            </Button>
          </div>

          <div className="sm:col-span-1 font-medium">
            {item.product.discount && item.product.discount > 0
              ? (
                  item.product.price *
                  (1 - item.product.discount / 100) *
                  item.quantity
                ).toLocaleString()
              : (item.product.price * item.quantity).toLocaleString()}
          </div>

          <div className="sm:col-span-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteItem(item.id)}
            >
              <FaTrash className="text-red-500" />
            </Button>
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center gap-4 text-sm">
        <div className="space-y-1">
          <p>
            Tổng ({selectedItems.length} sản phẩm):
            <span className="text-red-500 font-semibold ml-2 text-lg">
              {total.toLocaleString()}đ
            </span>
          </p>
        </div>
        <Button
          onClick={handleBuy}
          disabled={selectedItems.length === 0 || isLoading}
        >
          Mua hàng
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
