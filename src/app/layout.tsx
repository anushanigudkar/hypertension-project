import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Blood Pressure Care Questionnaire",
  description: "A short questionnaire about your blood pressure care and daily routine.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-dvh bg-canvas font-sans text-sage-900 antialiased`}>
        <div className="mx-auto min-h-dvh w-full max-w-screen">{children}</div>
      </body>
    </html>
  );
}
