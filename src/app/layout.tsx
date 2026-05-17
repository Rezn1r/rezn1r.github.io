import type { Metadata } from "next";
import "../styles/minecraft.css";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "rezn1r | Home",
  description:
    "Welcome to rezn1r's personal site with my stuff, projects, updates, and add-ons.",
  authors: [{ name: "rezn1r" }],
  metadataBase: new URL("https://reznir.dev"),
  openGraph: {
    type: "website",
    title: "rezn1r | Home",
    description:
      "Welcome to rezn1r's personal site with my stuff, projects, updates, and add-ons.",
    url: "https://reznir.dev/",
    images: ["/avatar.png"],
  },
  themeColor: "#b84c4c",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
