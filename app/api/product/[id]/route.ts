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
    const book = await prisma.product.findUnique({
      where: {
        slug: id,
      },
      include: {
        category: true, // lấy category
        reviews: {
          select: { rating: true }, // lấy rating
        },
        orderItems: {
          select: { quantity: true }, // lấy số lượng đã bán từ orderItems
        },
      },
    });
    if (!book) {
      return NextResponse.json(
        { message: "Sản phẩm không tồn tại" },
        { status: 404 }
      );
    }
    const totalSold = book.orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Tính điểm đánh giá trung bình
    const totalRating = book.reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating =
      book.reviews.length > 0 ? totalRating / book.reviews.length : 0;
    return NextResponse.json({
      ...book,
      totalSold,
      averageRating,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy book theo id" },
      { status: 500 }
    );
  }
}
