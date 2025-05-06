"use client";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader, XCircle } from "lucide-react";
import { getOrderById } from "../.././actions/order";
import {
  OrderItemWithProduct,
  OrderWithOrderItemsAndProduct,
} from "../.././types";
const PaymentReturn = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [success, setSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderWithOrderItemsAndProduct>();
  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    const responseSuccess = searchParams.get("success");
    const responseOrderId = searchParams.get("orderId");

    const isSuccess =
      responseCode === "00" && responseSuccess === "true" && responseOrderId;

    setSuccess(!!isSuccess);

    if (isSuccess) {
      const fetchdTour = async () => {
        try {
          setIsLoading(true);
          const bookingData = await getOrderById(responseOrderId);
          setOrder(bookingData);
        } catch (error) {
          console.error("Error fetching booking id:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchdTour();
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (success) {
      const end = Date.now() + 15 * 1000;
      const colors = ["#22c55e", "#3b82f6"];

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [success]);
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {success === null ? (
        <p>Đang kiểm tra trạng thái thanh toán...</p>
      ) : success && order ? (
        <div className="flex flex-col items-center">
          <CheckCircle size={64} className="text-green-600" />
          <h1 className="text-2xl font-bold mt-4 text-green-600">
            Thanh toán thành công!
          </h1>
          {order ? (
            <div className="my-3 shadow-2xl p-5 space-y-1.5">
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">Mã thanh toán:</p>
                <p className="text-sm font-semibold">{order.id}</p>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">Trạng thái:</p>
                <p className="text-sm font-semibold">
                  {order.status === "PAID"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </p>
              </div>
              {order.orderItems.map((item: OrderItemWithProduct) => (
                <>
                  <div className="flex items-center justify-between gap-x-2">
                    <p className="font-bold text-primary">Sách:</p>
                    <p className="text-sm font-semibold">{item.product.name}</p>
                  </div>
                  <div className="flex items-center justify-between gap-x-2">
                    <p className="font-bold text-primary">Giá:</p>
                    <p className="text-sm font-semibold">
                      {" "}
                      {item.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-x-2">
                    <p className="font-bold text-primary">Số lượng:</p>
                    <p className="text-sm font-semibold">
                      {item.quantity} cuốn
                    </p>
                  </div>
                </>
              ))}

              <div className="flex items-center justify-between gap-x-2">
                <p className="font-bold text-primary">Thời gian thanh toán:</p>
                <p className="text-sm font-semibold">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-bold text-red-600">
                Không tìm thấy thông tin tour.
              </h1>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 p-10">
              <Loader className="size-6 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-red-600 flex items-center flex-col">
          <XCircle size={64} />
          <h1 className="text-2xl font-bold mt-4">
            {!order ? "Có lỗi xảy ra" : "Thanh toán không thành công"}
          </h1>
          <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentReturn;
