import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نظام إدارة المنافسات والمشتريات - جامعة شقراء",
  description: "نظام متكامل لإدارة المنافسات، الضمانات، العقود، والصرف",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
