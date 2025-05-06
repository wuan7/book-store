import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id)
      return NextResponse.json(
        { message: "Không tìm thấy id" },
        { status: 400 }
      );
    const post = await prisma.article.findUnique({
      where: { slug: id },
      include: { postCategory: true },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Lỗi khi lấy bài viết theo id" },
      { status: 500 }
    );
  }
}
