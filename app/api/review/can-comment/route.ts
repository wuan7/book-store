import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { productId } = body;

  if (!productId) {
    return NextResponse.json(
      { allowed: false, message: "Thiếu productId." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  const purchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId: user?.id,
        status: "PAID",
      },
    },
  });

  return NextResponse.json({ allowed: Boolean(purchased) });
}
