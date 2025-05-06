import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(cart || { cartItems: [] });
}
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { productId, quantity } = await req.json();
  if (!productId || quantity <= 0)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  let cart = await prisma.cart.findFirst({ where: { userId: user.id } });
  if (!cart) cart = await prisma.cart.create({ data: { userId: user.id } });

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      },
    });
  }

  return NextResponse.json({ message: "Added to cart successfully" });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { cartItemId, quantity } = await req.json();

  if (!cartItemId || quantity < 1)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  // Lấy cart item hiện tại
  const existingItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!existingItem)
    return NextResponse.json(
      { message: "Cart item not found" },
      { status: 404 }
    );

  // Cộng dồn số lượng
  const updatedItem = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity: existingItem.quantity + quantity,
    },
  });

  return NextResponse.json(updatedItem);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { cartItemId } = await req.json();
  if (!cartItemId)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  await prisma.cartItem.delete({ where: { id: cartItemId } });
  return NextResponse.json({ message: "Item removed from cart" });
}
