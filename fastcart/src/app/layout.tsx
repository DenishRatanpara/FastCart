import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/provider/Provider";
import StoreProvider from "@/store/StoreProvider";
import InitUser from "@/InitUser";

export const metadata: Metadata = {
  title: "FastCart ",
  description: "10 minutes delivery app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-200 to-white-100 "
       
      >
        
     <Provider>
      <StoreProvider>
        <InitUser/>
         {children}
         </StoreProvider>
     </Provider>
      </body>
    </html>
  );
}
