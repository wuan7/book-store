import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
      const { email, password, name } = await req.json();
  
      if (!email || !password || !name) {
        return NextResponse.json({ error: "Thiếu thống tin" }, { status: 400 });
      }
  
      // Kiểm tra user đã tồn tại chưa
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });
      }
  
      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Tạo user mới
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
  
      return NextResponse.json({ message: "Đăng ký thành công!", user: newUser });
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  }
