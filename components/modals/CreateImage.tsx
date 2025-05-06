"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAdminModal } from "../../hooks/useAdminModal";
import ImageUpload from "../ImageUpload";
import { handleUploadImage } from "../../utils/uploadImage";
import { getProducts } from "../../actions/product";
import { Product } from "../../lib/generated/prisma";
const ImageSchema = z.object({
  productId: z.string().min(1, "Vui lòng chọn sách"),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePublicId: z.string().min(1, "Thiếu Public ID của ảnh"),
});
type ImageFormValues = z.infer<typeof ImageSchema>;
const CreateImage = () => {
  const { isOpenCreateImage, closeCreateImage } = useAdminModal();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [books, setBooks] = useState<Product[]>([]);
  const form = useForm<ImageFormValues>({
    resolver: zodResolver(ImageSchema),
    defaultValues: {
      imageUrl: "",
      imagePublicId: "",
      productId: "",
    },
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const onSubmit = async (data: ImageFormValues) => {
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
      const response = await fetch("/api/product/image", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo ảnh thành công!");
      form.reset();
      closeCreateImage();
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
      <Dialog open={isOpenCreateImage} onOpenChange={closeCreateImage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm category mới</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sách</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {books.length > 0 && books.map((book: Product) => (
                            <SelectItem key={book.id} value={book.id}>
                              {book.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                onClick={() => onSubmit(form.getValues())}
                className="w-full"
                disabled={isLoading}
              >
                Tạo ảnh cho sản phẩm
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateImage;
