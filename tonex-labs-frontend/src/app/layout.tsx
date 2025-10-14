import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter, Ubuntu_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ToneX-Labs",
  description: "ToneX-Labs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const ubuntuSans = Ubuntu_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ubuntuSans.className}`}>
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
