import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách sản phẩm." },
      { status: 500 }
    );
  }
}