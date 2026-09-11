import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/martian-mono/wdth.css";
import { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteUrl } from "./helpers/url";

const martianGrotesk = localFont({
  src: "./fonts/MartianGrotesk[wdth,wght].woff2",
  display: "swap",
  variable: "--font-martian",
  fallback: ["system-ui"],
  weight: "100 900",
});

const title = "Mapshaver";
const description =
  "Schematized maps on demand. Shave down vertices for smoother maps – Treat your polygons right.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: title,
    url: siteUrl,
    type: "website",
    images: [
      {
        // Relative, so that metadataBase puts the base path in front of it.
        url: "mapshaver.png",
        width: 1200,
        height: 630,
        alt: "Mapshaver, over a schematized map of central Europe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["mapshaver.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={martianGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
