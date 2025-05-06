"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, Sun, Moon } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { useAuthModal } from "../../hooks/useAuthModal";
import { useSession } from "next-auth/react";
import UserAvatar from "./UserAvatar";
import { getCartByUser } from "../../actions/cart";
import { cartItemCountAtom } from "../../atoms/cartAtom";
import { useAtom } from "jotai";
import SearchBox from "../SearchBox";
const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Sách", href: "/books" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Bài viết", href: "/blog" },
  { label: "Giỏ hàng", href: "/cart" },
];
type SessionUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: "USER" | "ADMIN";
};
const Header = () => {
  const session = useSession();
  const [cartItemCount, setCartItemCount] = useAtom(cartItemCountAtom);
  const pathname = usePathname();
  const scrollDirection = useScrollDirection();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { openLogin, openRegister } = useAuthModal();

  // Đảm bảo không lỗi hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const fetchCart = async () => {
      const cart = await getCartByUser();
      setCartItemCount(cart.cartItems.length);
    };
    fetchCart();
  }, [cartItemCount, setCartItemCount]);
  const toggleDarkMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={`w-full shadow-sm  border-b bg-white dark:bg-black sticky top-0 z-50 transition-transform duration-300 ${
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:py-3 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <div className="relative w-20 h-16">
            <Image
              src="/book-st.png"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
        </Link>

        <div className="hidden lg:flex flex-1 mx-6">
          <SearchBox />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {/* Dark Mode Toggle */}
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="p-2 rounded-full cursor-pointer"
            >
              {resolvedTheme === "dark" ? (
                <Moon className=" h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              )}
            </Button>
          )}

          {session.status !== "authenticated" && (
            <div className="ml-4 flex gap-2">
              <Button variant="outline" onClick={openLogin}>
                Đăng nhập
              </Button>
              <Button onClick={openRegister}>Đăng ký</Button>
            </div>
          )}
          {session?.data?.user ? (
            <UserAvatar data={session.data.user as SessionUser} />
          ) : null}

          <Link href="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </nav>

        {/* Mobile Nav */}
        <div className="flex gap-x-2 md:hidden">
          {/* Dark Mode Toggle */}
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="p-2 rounded-full cursor-pointer"
            >
              {resolvedTheme === "dark" ? (
                <Moon className=" h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              )}
            </Button>
          )}
          <div className="">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-6 p-3">
                  {session?.data?.user ? (
                    <div className="flex gap-x-1.5 items-center">
                    <UserAvatar data={session.data.user as SessionUser} />
                    <p className="font-bold">{session.data.user.name}</p>
                    </div>
                  ) : null}
                  
                </div>
                <div className="flex flex-col gap-4  p-3">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`transition ${
                          isActive
                            ? "text-blue-600 font-semibold"
                            : "text-gray-700 dark:text-gray-200 hover:text-blue-600"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                   {session?.status !== "authenticated" && (
                    <div className=" flex flex-col gap-2">
                      <Button variant="outline" onClick={openLogin} className="w-full">
                        Đăng nhập
                      </Button>
                      <Button onClick={openRegister} className="w-full">Đăng ký</Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <div className="block lg:hidden flex-1 ">
        <SearchBox />
      </div>
    </header>
  );
};

export default Header;
