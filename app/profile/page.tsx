"use client";

import React, { useEffect, useState } from "react";
import { getUserById } from "../.././actions/user";
import { TriangleAlert, Eye, EyeOff, Loader } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import ImageUpload from "../../components/ImageUpload";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { UserWithAccount } from "../../types";
import { handleUploadImage } from "../.././utils/uploadImage";
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
  
  type ProfileFormData = z.infer<typeof profileSchema>;
const ProfilePage = () => {

    const session = useSession();
  const [user, setUser] = useState<UserWithAccount>();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchUser = async (id: string) => {
      try {
        setIsLoading(true);
        const userData = await getUserById(id);
        setUser(userData);
        form.reset({
          name: userData.name || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session.data?.user?.id) {
      fetchUser(session.data.user.id);
    }
  }, [session.data?.user?.id, form]);

  const onSubmit = async (values: ProfileFormData) => {
    try {
      setIsLoading(true);
      if (files.length > 0) {
        const uploadedImage = await handleUploadImage(files, setIsLoading);
        if (!uploadedImage) return;
        values.imageUrl = uploadedImage.url;
        values.imagePublicId = uploadedImage.publicId;
      }

      const response = await fetch(`/api/user/${session?.data?.user?.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      const updatedUser = await response.json();

      if (!response.ok) {
        throw new Error(updatedUser.message || "Lỗi khi cập nhật thông tin người dùng");
      }

      toast.success("Cập nhật thành công!");
      form.reset({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
      });
      setFiles([]);
      await session.update({
        name: updatedUser.name,
        imageUrl: updatedUser.imageUrl,
      });
      setUser(updatedUser);
      setIsEditing(false)
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if(isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-2">
        <Loader className="animate-spin  size-6" />
      </div>
    )

  }
  if (!user) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">Không có dữ liệu</h1>
        <TriangleAlert className="text-red-500 w-10 h-10" />
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Avatar + Info */}
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300">
          <Image
            src={user.imageUrl || "/img/avatar.png"}
            alt={user.name || "User"}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p className="text-xl text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400">ID: {user.id}</p>
        </div>
      </div>

      {/* Personal Info */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="font-medium text-lg">Ngày tham gia</p>
            <p className="text-gray-600">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Email - chỉ hiển thị */}
          <FormField
            control={form.control}
            name="email"
            render={() => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <p className="text-gray-600">{user.email}</p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Họ tên */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                {isEditing ? (
                  <FormControl>
                    <Input placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                ) : (
                  <p className="text-gray-600">{user.name}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password - chỉ khi đang chỉnh sửa và không dùng Google */}
          {isEditing && !user.accounts.length && (
            <>
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu hiện tại"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Ảnh đại diện */}
          {isEditing && (
            <div className="space-y-4">
              <FormLabel>Ảnh đại diện</FormLabel>
              <ImageUpload files={files} setFiles={setFiles} loading={isLoading} />
            </div>
          )}

          {/* Submit & Cancel */}
          {isEditing && (
            <div className="flex justify-end gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                Lưu thay đổi
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset({ name: user.name || "" });
                  setFiles([]);
                  setIsEditing(false);
                }}
              >
                Hủy
              </Button>
            </div>
          )}
        </form>
      </Form>

      {/* Nút chỉnh sửa nằm ngoài form để không submit */}
      {!isEditing && (
        <div className="flex justify-end pt-4">
          <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
            Chỉnh sửa thông tin
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProfilePage