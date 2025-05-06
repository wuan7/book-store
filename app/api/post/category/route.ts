import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "default";
    const category = searchParams.get("category") || undefined;

    const sortOption: { createdAt?: "asc" | "desc" } | undefined =
      sort === "asc"
        ? { createdAt: "asc" }
        : sort === "desc"
        ? { createdAt: "desc" }
        : undefined;

    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      prisma.article.findMany({
        skip,
        take: limit,
        orderBy: sort ? sortOption : undefined,
        where: {
          ...(category && { postCategory: { name: category } }),
        },
        include: {
          postCategory: true,
        },
      }),
      prisma.article.count({
        where: {
          ...(category && { postCategory: { name: category } }),
        },
      }),
    ]);

    return NextResponse.json({
      posts,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách bài viết." },
      { status: 500 }
    );
  }
}
