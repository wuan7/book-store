import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "../../lib/generated/prisma";
import Link from "next/link";
interface UserAvatarProps {
  data: Partial<User>
}

const UserAvatar = ({ data }: UserAvatarProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer !outline-none">
          <Avatar>
            <AvatarImage src={data.imageUrl || "/img/avatar.png"} />
            <AvatarFallback>{data.name && data?.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem><Link href="/profile">Thông tin cá nhân</Link></DropdownMenuItem>
          <DropdownMenuItem><Link href="/order">Lịch sử đặt hàng</Link></DropdownMenuItem>
          {data.role === "ADMIN" && (
            <DropdownMenuItem><Link href="/admin">Trang quản trị</Link></DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => signOut()}>Đăng xuất</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAvatar;