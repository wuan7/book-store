import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Lấy ID từ URL path
    if (!id)
      return NextResponse.json(
        { message: "Không tìm thấy id" },
        { status: 400 }
      );
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      include: { user: true },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy review" },
      { status: 500 }
    );
  }
}
