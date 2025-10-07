import "./globals.css";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/app/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MetaMint - Mutual Fund Explorer",
  description: "Explore mutual funds with advanced calculators and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
