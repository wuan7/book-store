import type { Metadata } from "next";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import HeaderWrapper from "../components/layout/HeaderWrapper";
import { ThemeProvider } from "../components/theme-provider";
import { JotaiProvider } from "../components/JotaiProvider";
import Modals from "../components/Modals";
import RemoveFacebookHash from '../components/RemoveFacebookHash'
import ToastWrapper from "../components/ToastWrapper";
export const metadata: Metadata = {
  title: "Book Store",
  description: "Book Store",
  icons: {
    icon: "/book-st.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <JotaiProvider>
          <SessionProvider>
            <Modals />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <HeaderWrapper />
              <ToastWrapper />
              <RemoveFacebookHash />
              {children}
            </ThemeProvider>
          </SessionProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
