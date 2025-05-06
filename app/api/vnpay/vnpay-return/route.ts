import { NextRequest, NextResponse } from 'next/server';
import qs from 'qs';
import crypto from 'crypto';
import { prisma } from '../../../../lib/prisma';
import { VNPAY_CONFIG } from '../../../../config/vnpay';

const sortObject = (obj: Record<string, string>): Record<string, string> => {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, string>, key: string) => {
      result[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
      return result;
    }, {});
};

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const params = Object.fromEntries(url.searchParams.entries());

  const secureHash = params['vnp_SecureHash'];
  delete params['vnp_SecureHash'];
  delete params['vnp_SecureHashType'];

  const sortedParams = sortObject(params);
  const signData = qs.stringify(sortedParams, { encode: false });

  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.hashSecret);
  const signed = hmac.update(signData).digest('hex');

  if (secureHash !== signed) {
    return NextResponse.json({ message: 'Sai chữ ký', success: false }, { status: 400 });
  }

  const responseCode = params['vnp_ResponseCode'];
  const orderId = params['vnp_OrderInfo'];

  if (responseCode === '00') {
    try {
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
        },
      });

      if (!existingOrder) {
        return NextResponse.json({ message: 'Không tìm thấy đơn hàng', success: false }, { status: 404 });
      }

      if (existingOrder.status !== 'PENDING') {
        return NextResponse.redirect(`${VNPAY_CONFIG.returnUrl}?success=false&reason=already-processed`);
      }

      // Transaction: cập nhật đơn hàng và các sản phẩm liên quan
      await prisma.$transaction(async (tx) => {
        // 1. Cập nhật trạng thái đơn hàng
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            expiredAt: null,
          },
        });

        // 2. Cập nhật từng sản phẩm
        for (const item of existingOrder.orderItems) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { reserved: true },
          });

          if (!product) continue;

          const newReserved = Math.max(product.reserved - item.quantity, 0);

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              reserved: { set: newReserved },
            },
          });
        }
      });

      return NextResponse.redirect(
        `${VNPAY_CONFIG.returnUrl}?vnp_ResponseCode=${responseCode}&success=true&orderId=${orderId}`
      );
    } catch (error) {
      console.error('Lỗi transaction:', error);
      return NextResponse.json({ message: 'Lỗi xử lý đơn hàng', success: false }, { status: 500 });
    }
  } else {
    return NextResponse.redirect(`${VNPAY_CONFIG.returnUrl}?success=false`);
  }
}
