import { prisma } from '../lib/prisma';

export async function expirePendingOrders() {
  const now = new Date();

  // Tìm tất cả đơn hàng PENDING đã hết hạn
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: 'PENDING',
      expiredAt: {
        lt: now,
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  console.log(`🔁 Đang xử lý ${expiredOrders.length} đơn hết hạn`);

  for (const order of expiredOrders) {
    // Trả lại số lượng đã giữ (reserved)
    for (const item of order.orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          reserved: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Hủy đơn hàng
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'CANCELED',
      },
    });

    console.log(`❌ Đơn hàng ${order.id} đã bị hủy vì hết hạn`);
  }

  return {
    canceledCount: expiredOrders.length,
  };
}
