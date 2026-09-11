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

const siteName = "Mapshaver";
const title = `${siteName} – Schematized maps on demand`;
const description =
  "Schematized maps on demand. Drop in your geodata and shave off vertices for a smoother map: simplify and stylize polygon data, every feature keeping its size.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  // The template names the pages below, which set a title of their own.
  title: { default: title, template: `%s · ${siteName}` },
  description,
  openGraph: {
    title,
    description,
    siteName,
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
