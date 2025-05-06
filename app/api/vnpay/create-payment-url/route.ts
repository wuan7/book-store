import { NextRequest, NextResponse } from 'next/server';
import qs from 'qs';
import crypto from 'crypto';
import moment from 'moment';

export async function POST(req: NextRequest) {
  try {
    const { amount, bookingId } = await req.json();
    console.log("amount", amount, "bookingId", bookingId);
    if (!amount || !bookingId) {
      return NextResponse.json({ message: 'Thiếu thông tin thanh toán' }, { status: 400 });
    }

    const tmnCode = process.env.VNP_TMN_CODE!;
    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpUrl = process.env.VNP_URL!;
    const returnUrl = process.env.VNP_RETURN_URL!;

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const orderId = moment(date).format("DDHHmmss");

    const ipAddr = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    let vnp_Params: Record<string, string | number> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: bookingId,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    // Hàm sort và encode giống như web đặt vé
    const sortObject = (obj: Record<string, string | number>): Record<string, string> => {
      return Object.keys(obj)
        .sort()
        .reduce((result: Record<string, string>, key: string) => {
          result[key] = encodeURIComponent(String(obj[key])).replace(/%20/g, "+");
          return result;
        }, {});
    };

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    console.error("VNPay Error:", error);
    return NextResponse.json({ message: "Lỗi tạo URL thanh toán" }, { status: 500 });
  }
}