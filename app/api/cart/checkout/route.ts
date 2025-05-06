import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

export async function DELETE(req: Request) {
  try {
    const { cartItems } = await req.json();

    const session = await auth();
    if (!session?.user?.email)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ message: "No cart items selected" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { carts: true },
    });

    if (!user || user.carts.length === 0)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const cartIds = user.carts.map((cart) => cart.id);
    const cartItemIds = cartItems.map((item: { id: string }) => item.id);

    const result = await prisma.cartItem.deleteMany({
      where: {
        id: { in: cartItemIds },
        cartId: { in: cartIds },
      },
    });

    return NextResponse.json({ message: "Cart items deleted", count: result.count });
  } catch (error) {
    console.error("Delete CartItem error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
