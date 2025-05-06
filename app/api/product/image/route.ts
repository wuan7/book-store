import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { productId, imageUrl, imagePublicId } = body;

    if (!imageUrl || !imagePublicId || !productId) {
      return NextResponse.json({ error: "Thieu thong tin" }, { status: 400 });
    }

    const newProduct = await prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        imagePublicId,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo ảnh cho sách:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}


