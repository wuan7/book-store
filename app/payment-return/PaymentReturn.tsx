"use client";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle,  Loader2, XCircle } from "lucide-react";
import { getOrderById } from "../.././actions/order";
import { OrderWithOrderItemsAndProduct } from "../.././types";
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
      {success === null ||
        (isLoading && (
          <div className="flex flex-col items-center max-w-3xl h-28">
            <Loader2 className="animate-spin size-6" />
          </div>
        ))}

      {success === false && (
        <div className="flex flex-col items-center">
          <XCircle size={64} className="text-red-600" />
          <h1 className="text-2xl font-bold mt-4 text-red-600">
            Thanh toán thất bại
          </h1>
        </div>
      )}

      {success && order && (
        <div className="flex flex-col items-center">
          <CheckCircle size={64} className="text-green-600" />
          <h1 className="text-2xl font-bold mt-4 text-green-600">
            Thanh toán thành công!
          </h1>
        </div>
      )}
    </div>
  );
};

export default PaymentReturn;
