import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, comment, imageUrl, imagePublicId } = body;

    if (!productId || !rating || !comment.trim()) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Kiểm tra xem đã từng review sản phẩm này chưa
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: user.id,
      },
    });

    let review;
    if (existingReview) {
      // Nếu đã có review -> cập nhật lại
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: Number(rating),
          comment,
          imageUrl,
          imagePublicId,
        },
      });
    } else {
      // Nếu chưa có review -> tạo mới
      review = await prisma.review.create({
        data: {
          productId,
          rating: Number(rating),
          comment,
          userId: user.id,
          imageUrl,
          imagePublicId,
        },
      });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
