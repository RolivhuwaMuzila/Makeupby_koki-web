import "./globals.css";
import Link from "next/link";
import Nav from "@/components/Nav";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

const serif = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--serif" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--sans" });

export const metadata = {
  title: "MakeUpBy_Koki",
  description: "Makeup, bridal, hair and customised wigs in Roodepoort, Florida. Book and pay online.",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        <Nav />
        {children}
        <footer><div className="wrap">© {new Date().getFullYear()} MakeUpBy_Koki · Roodepoort, Florida · 079 462 9524 · <Link href="/contact" style={{ textDecoration: "underline" }}>Contact</Link></div></footer>
      </body>
    </html>
  );
}
