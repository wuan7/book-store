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
const CategorySchema = z.object({
  name: z.string().min(1, "Tên category không được để trống"),
});
type CategoryFormValues = z.infer<typeof CategorySchema>;
const CreatePostCategory = () => {
  const { isOpenCreatePostCategory, closeCreatePostCategory } = useAdminModal();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
     
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    console.log("Dữ liệu đã nhập:", data);
   
    try {
      setIsLoading(true);
      const response = await fetch("/api/category/post", {
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
      closeCreatePostCategory();
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog open={isOpenCreatePostCategory} onOpenChange={closeCreatePostCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm category cho bài viết</DialogTitle>
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

export default CreatePostCategory;
