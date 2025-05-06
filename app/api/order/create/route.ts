/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const userId = session.user.id;
    const { items, type } = await req.json(); // items: Array<{ productId: string; quantity: number }>

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const productIds = items.map((item) => item.productId);

    // Sử dụng transaction để đảm bảo tính chính xác và tránh race condition
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== items.length) {
        return NextResponse.json(
          { error: "Một số sản phẩm không tồn tại" },
          { status: 404 }
        );
      }

      // Kiểm tra tồn kho và tính giá cho từng sản phẩm
      const orderItemsData = [];
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }

        const available = product.stock - product.reserved;
        if (available < item.quantity) {
          throw new Error(`Không đủ hàng cho sản phẩm ${product.name}`);
        }

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Tạo đơn hàng với trạng thái PENDING và hết hạn sau 10 phút
      const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

      const newOrder = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          expiredAt,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: true,
        },
      });

      // Cập nhật số lượng đã đặt cho từng sản phẩm (reserved)
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            reserved: { increment: item.quantity },
          },
        });
      }

      return newOrder;
    });
    if (type === "BUY") {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { carts: true },
      });

      if (!user || user.carts.length === 0)
        return NextResponse.json(
          { message: "Cart not found" },
          { status: 404 }
        );
      const cartIds = user.carts.map((cart) => cart.id);
      const cartItemIds = items.map((item: { id: string }) => item.id);

      await prisma.cartItem.deleteMany({
        where: {
          id: { in: cartItemIds },
          cartId: { in: cartIds },
        },
      });
    }

    return NextResponse.json({ message: "Đã tạo đơn hàng thành công", order });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return NextResponse.json(
      { error: error.message || "Đã xảy ra lỗi khi tạo đơn hàng" },
      { status: 400 }
    );
  }
}
