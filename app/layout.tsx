import React, { ReactNode } from "react";
import "./globals.css";
import { Header } from "./components/shared/header";
import { Footer } from "./components/shared/footer";

export const metadata = {
  title: "Xterium",
  description: "A simple website for Xterium UI",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        style={{ backgroundImage: "url('/assets/xterium_bg-05.png')" }}
        className="bg-no-repeat bg-cover"
      >
        <header className="sticky top-0 w-full z-30">
          <Header />
        </header>

        <main className="min-h-screen">{children}</main>

        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
