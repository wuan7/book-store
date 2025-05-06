import { prisma } from "../../../../../lib/prisma";
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
  
      const images = await prisma.productImage.findMany({
        where: {
          productId: id,
        },
      });
      return NextResponse.json(images);
    } catch (error) {
      console.log("Lỗi khi lấy ảnh cho sách:", error);
      return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
    }
  }