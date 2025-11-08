import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  DM_Sans,
  Inter,
} from "next/font/google";
import "./globals.css";

// const heading = Bricolage_Grotesque({
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["300", "400", "500", "600", "700"],
//   variable: "--font-heading",
// });

const body = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const ui = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "IQMento — College Insider",
  description:
    "Navigate your college journey with trusted mentor insights, curated alumni stories, and real-world pathways.",
  metadataBase: new URL("https://iqmento.com"),
  openGraph: {
    title: "IQMento — College Insider",
    description:
      "Navigate your college journey with trusted mentor insights, curated alumni stories, and real-world pathways.",
    url: "https://iqmento.com",
    siteName: "IQMento",
  },
  twitter: {
    card: "summary_large_image",
    title: "IQMento — College Insider",
    description:
      "Navigate your college journey with trusted mentor insights, curated alumni stories, and real-world pathways.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-surface text-foreground">
      <body
        className={[
          // heading.variable,
          body.variable,
          ui.variable,
          "antialiased",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
