import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";
import removeAccents from "remove-accents";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      price,
      discount,
      description,
      imageUrl,
      imagePublicId,
      categoryId,
      stock,
      author,
    } = body;

    if (
      !name ||
      !price ||
      !description ||
      !imageUrl ||
      !imagePublicId ||
      !categoryId ||
      !stock ||
      !author
    ) {
      return NextResponse.json({ error: "Thieu thong tin" }, { status: 400 });
    }
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const slugBook = slugify(name, {
      lower: true,
      locale: "vi",
      strict: true,
    });
    const slug = `${slugBook}-${randomSuffix}`;
    const removeAccentsName = removeAccents(name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        nameUnsigned: removeAccentsName,
        price: parseFloat(price),
        categoryId,
        stock: parseInt(stock),
        author,
        discount: discount ? parseFloat(discount) : 0,
        description,
        imageUrl,
        imagePublicId,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo sách:", error);
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "default";
    const category = searchParams.get("category") || undefined;

    // Cấu hình sortOption tùy vào giá trị `sort`
    const sortOption: { price?: 'asc' | 'desc', createdAt?: 'desc' } | undefined =
      sort === "asc"
        ? { price: "asc" }
        : sort === "desc"
        ? { price: "desc" }
        : sort === "new"
        ? { createdAt: "desc" }
        : undefined;

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: sort !== "bestSelling" ? sortOption : undefined,
        where: {
          ...(category && { category: { name: category } }),
        },
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
          discount: true,
          description: true,
          imageUrl: true,
          stock: true,
          orderItems: {
            where: {
              order: {
                status: "PAID",
              },
            },
            select: {
              quantity: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.product.count(
        {
          where: {
            ...(category && { category: { name: category } }),
          },
        }
      ),
    ]);

    const productsWithExtras = products.map((product) => {
      const totalSold = product.orderItems.reduce(
        (sum, o) => sum + o.quantity,
        0
      );
      const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating =
        product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

      return {
        ...product,
        averageRating,
        totalSold,
      };
    });

    // Xử lý bestSelling thủ công
    if (sort === "bestSelling") {
      productsWithExtras.sort((a, b) => b.totalSold - a.totalSold);
    }

    return NextResponse.json({
      products: productsWithExtras,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi lấy danh sách sản phẩm." },
      { status: 500 }
    );
  }
}

