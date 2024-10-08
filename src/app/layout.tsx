import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { api } from "@/trpc/server";
import { Toaster } from "sonner";
import Header from "@/components/client/Header";

export const metadata: Metadata = {
  title: "profilefyi cart",
  description: "cart made with tRPC",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const cart = await api.cart.getCart();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Header initalCart={cart} />
          {children}
          <Toaster richColors position="top-center" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
