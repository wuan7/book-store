import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../../../../lib/generated/prisma";


export async function GET(req: Request) {
    try {
      const url = new URL(req.url);
      const id = url.pathname.split('/').pop(); // Lấy ID từ URL path
      
      if (!id)
        return NextResponse.json(
          { message: "Không tìm thấy id" },
          { status: 400 }
        );
      const user = await prisma.user.findUnique({
        where: { id },
        include: { accounts: true },
      });
      return NextResponse.json(user);
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Lỗi khi lấy user theo id" },
        { status: 500 }
      );
    }
  }
  
  const profileSchema = z.object({
    name: z.string().min(1, "Vui lòng nhập họ tên"),
    email: z.string(),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
      .optional()
      .or(z.literal("")),
    imageUrl: z.string().optional(),
    imagePublicId: z.string().optional(),
  });
  export async function PUT(req: Request) {
    
    try {
      const url = new URL(req.url);
      const id = url.pathname.split("/").pop();
  
      if (!id) {
        return NextResponse.json(
          { message: "Không tìm thấy ID" },
          { status: 400 }
        );
      }
  
      const body = await req.json();
  
      // Validate dữ liệu
      const data = profileSchema.parse(body);
  
      const user = await prisma.user.findUnique({ where: { id } });
  
      if (!user) {
        return NextResponse.json(
          { message: "Người dùng không tồn tại" },
          { status: 404 }
        );
      }
  
      const updateData: Partial<User> = {};
  
      // Cập nhật các trường cơ bản
      if (data.name) updateData.name = data.name;
      if (data.email) updateData.email = data.email;
      if (data.imageUrl) updateData.imageUrl = data.imageUrl;
      if (data.imagePublicId) updateData.imagePublicId = data.imagePublicId;
  
      // Xử lý cập nhật mật khẩu nếu có
      if (data.newPassword?.trim()) {
        if (!data.currentPassword) {
          return NextResponse.json(
            { message: "Vui lòng nhập mật khẩu hiện tại" },
            { status: 400 }
          );
        }
  
        // Trường hợp user không có password (VD: login bằng Google)
        if (!user.password) {
          return NextResponse.json(
            { message: "Tài khoản không hỗ trợ đổi mật khẩu" },
            { status: 400 }
          );
        }
  
        const isMatch = await bcrypt.compare(data.currentPassword, user.password);
        if (!isMatch) {
          return NextResponse.json(
            { message: "Mật khẩu hiện tại không đúng" },
            { status: 401 }
          );
        }
  
        const hashed = await bcrypt.hash(data.newPassword, 10);
        updateData.password = hashed;
      }
  
      // Nếu không có gì để update
      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { message: "Không có dữ liệu để cập nhật" },
          { status: 400 }
        );
      }
     
      
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        include: { accounts: true },
      });
     
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      return NextResponse.json(
        { message: "Lỗi khi cập nhật user" },
        { status: 500 }
      );
    }
  }