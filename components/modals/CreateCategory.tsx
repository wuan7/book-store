"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAdminModal } from "../../hooks/useAdminModal";
import ImageUpload from "../ImageUpload";
import { handleUploadImage } from "../../utils/uploadImage";
const CategorySchema = z.object({
  name: z.string().min(1, "Tên category không được để trống"),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePublicId: z.string().min(1, "Thiếu Public ID của ảnh"),
});
type CategoryFormValues = z.infer<typeof CategorySchema>;
const CreateCategory = () => {
  const { isOpenCreateCategory, closeCreateCategory } = useAdminModal();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      imagePublicId: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    console.log("Dữ liệu đã nhập:", data);
    if (files.length <= 0) {
      toast.error("Vui lòng tải ảnh lên");
      return;
    }
    const uploadedImage = await handleUploadImage(files, setIsLoading);
    if (!uploadedImage) {
      toast.warning("Tải ảnh lên thất bại");
      return;
    }
    data.imageUrl = uploadedImage.url;
    data.imagePublicId = uploadedImage.publicId;
    try {
      setIsLoading(true);
      const response = await fetch("/api/category", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo category thành công!");
      form.reset();
      closeCreateCategory();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {/* Dialog hiển thị form */}
      <Dialog open={isOpenCreateCategory} onOpenChange={closeCreateCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm category mới</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên category</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <FormControl>
                  <ImageUpload
                    files={files}
                    setFiles={setFiles}
                    loading={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <Button type="submit" onClick={() => onSubmit(form.getValues())}  className="w-full" disabled={isLoading}>
                Tạo category
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateCategory;
