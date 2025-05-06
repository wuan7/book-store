import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";
import removeAccents from "remove-accents";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name} = body;

    if (!name) {
      return NextResponse.json({ message: "Thiếu dữ liệu." }, { status: 400 });
    }
    const slugBook = slugify(name, {
      lower: true,
      locale: "vi",
      strict: true,
    });

    const removeAccentsName = removeAccents(name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    const category = await prisma.postCategory.create({
      data: {
        name,
        slug: slugBook,
        nameUnsigned: removeAccentsName,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo category:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi tạo category." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.postCategory.findMany();

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách category:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách category." },
      { status: 500 }
    );
  }
}
