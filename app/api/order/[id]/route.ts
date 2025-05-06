import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Lấy ID từ URL path
    if (!id)
      return NextResponse.json(
        { message: "Không tìm thấy id" },
        { status: 400 }
      );
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        orderItems: {
            include: {
                product: true,
            },
        }
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
