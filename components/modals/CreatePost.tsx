import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "react-toastify";
import { useAdminModal } from "../../hooks/useAdminModal";
import ImageUpload from "../ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPostCategories } from "@/actions/category";
import { Category } from "@/lib/generated/prisma";
import { useSession } from 'next-auth/react';

interface CreatePostProps {
  content: string;
}
const PostSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  imageUrl: z.string().url("URL ảnh không hợp lệ"),
  imagePublicId: z.string().min(1, "Thiếu Public ID của ảnh"),
  categoryId: z.string().min(1, "Bạn phải chọn category"),
  content: z.string(),
  userId: z.string(),
});

type PostFormValues = z.infer<typeof PostSchema>;

const CreatePost = ({content}: CreatePostProps) => {
   const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpenCreatePost, closeCreatePost } = useAdminModal();
  const [categories, setCategories] = useState<Category[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const form = useForm<PostFormValues>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      imagePublicId: "",
      categoryId: "",
      content: "",
      userId: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getPostCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const onSubmit = async (data: PostFormValues) => {
    
    data.content = content;
    console.log("Dữ liệu đã nhập:", data);
    if (files.length <= 0) {
      toast.error("Vui lòng tải ảnh lên");
      return;
    }
    const uploadedImage = await handleUploadImage();
    if (!uploadedImage) {
      return;
    }
    
    data.imageUrl = uploadedImage.url;
    data.imagePublicId = uploadedImage.publicId;
    if (!session.data?.user?.id) {
      toast.error("Vui lòng đăng nhập");
      return;
    }
    data.userId = session.data?.user?.id
    try {
      setIsLoading(true);
      const response = await fetch("/api/post", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Tạo bài viết thành công!");
      form.reset();
      setFiles([]);
      closeCreatePost();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };
  const handleUploadImage = async () => {
    const formData = new FormData();
    formData.append("file", files[0]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Lỗi tải ảnh lên Cloudinary");
      const data = await res.json();
      const publicId = data.url.split("/").pop().split(".")[0];
      toast.success("Tải ảnh thành công!");
      return { url: data.url, publicId };
    } catch (error) {
      console.log(error);
      toast.error("Lỗi tải ảnh!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog open={isOpenCreatePost} onOpenChange={closeCreatePost}>
        <DialogContent className="h-[80vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Thêm bài viết</DialogTitle>
          </DialogHeader>

          {/* Form sử dụng React Hook Form + Shadcn */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Tên khu vực */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề bài viết</FormLabel>
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

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value} // Set giá trị từ form
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat: Category) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
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
                className="w-full"
                disabled={isLoading}
                onClick={() => onSubmit(form.getValues())}
              >
                Tạo bài viết
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePost;