import React, { ReactNode } from "react";
import "./globals.css";
import { Header } from "./components/shared/header";
import { Footer } from "./components/shared/footer";
import Script from "next/script";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-no-repeat bg-top bg-[length:200%_auto] md:bg-[length:100%_auto]"
        style={{
          backgroundImage: "url('/assets/xterium_bg-05.png')",
        }}
      >
        <div className="lg:w-[100%] sm:w-[50%] mx-auto">
          <Script
            src="https://embed.imur.ai/chat-embed.min.js"
            data-embed-id="ddfb456b8dfe2dee5e4d64debf3ecf096645fda973f5b5ff39b883cfd5fee6bd"
            data-virtual-assistant-id="679c777e947013d228ddda78"
            data-websocket-url="wss://sme-api.imur.ai/api/llm/connect-socket/"
            data-theme-accent-bg-color="#0fbab5"
            data-theme-accent-text-color="#FFFFFF"
            data-theme-body-bg-color="#0fbab5"
            data-user-bubble-bg-color="#0fbab5"
            data-user-bubble-text-color="#FFFFFF"
            data-assistant-text-color="#000000"
            data-send-button-bg-color="#0fbab5"
          ></Script>
        </div>
        <header className="sticky top-0 w-full z-30 h-0">
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
