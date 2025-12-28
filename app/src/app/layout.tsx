import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DataForge | Master Data Engineering Interviews",
  description: "Gamified interview preparation for data engineers. Learn real-world concepts through interactive challenges, quizzes, and hands-on practice.",
  keywords: ["data engineering", "interview prep", "SQL", "data modeling", "ETL", "data warehouse"],
  authors: [{ name: "DataForge" }],
  openGraph: {
    title: "DataForge | Master Data Engineering Interviews",
    description: "Gamified interview preparation for data engineers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
