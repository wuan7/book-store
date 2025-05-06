import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useAuthModal } from "../../hooks/useAuthModal";
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
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
});
const SignUp = () => {
  const { authModal, closeModal, openLogin } = useAuthModal();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    mode: "onChange", // Kiểm tra lỗi ngay khi nhập
  });

  const onSubmit = async (values: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      console.log("Đăng ký với:", values);
      setIsLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setIsLoading(false);
      if (!res.ok) {
        const error = await res.json();
        toast.error("Đăng ký thất bại" + error.message);
        return;
      }

      toast.success("Đăng ký thành công");

      closeModal();
      openLogin();
    } catch (error) {
      console.log("Lỗi khi gửi yêu cầu đăng ký:", error);
    }
  };

  const handleClose = () => {
    closeModal();
  };
  return (
    <div>
      <Dialog open={authModal === "register"} onOpenChange={handleClose}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle>Đăng ký</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-primary"
                  disabled={!form.formState.isValid || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Đăng Ký"
                  )}
                </Button>
                <div className="flex items-center gap-2 my-4">
                  <hr className="flex-1 border-gray-300" />
                  <span className="text-sm text-gray-500">
                    Hoặc đăng ký với
                  </span>
                  <hr className="flex-1 border-gray-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    disabled={isLoading}
                    onClick={async () => {
                      await signIn("google");
                    }}
                    className="w-full cursor-pointer border  bg-[#D1F0FF] hover:bg-primary/40 text-[#024590]"
                  >
                    Google{" "}
                    <FcGoogle />
                  </Button>
                  
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SignUp;