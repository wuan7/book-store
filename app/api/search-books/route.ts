import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import removeAccents from "remove-accents";
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
  
    if (!query) return NextResponse.json([]);

    const removeAccentsName = removeAccents(query)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    const books = await prisma.product.findMany({
      where: {
        nameUnsigned: {
          contains: removeAccentsName,
          mode: "insensitive", // không phân biệt hoa thường
        },
      },
      take: 10,
    });
  
    return NextResponse.json(books);
  }