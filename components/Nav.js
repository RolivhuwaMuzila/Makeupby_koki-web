"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Cal, Img, Star, Bag, Lock } from "./Icons";

const TABS = [["/", "Home", Home, "Home"], ["/book", "Book", Cal, "Book"], ["/work", "Work", Img, "Her work"],
  ["/matric", "Matric", Star, "Matric packages"], ["/shop", "Wigs", Bag, "Glueless wigs"]];

export default function Nav() {
  const path = usePathname();
  const admin = path === "/admin";
  return (<>
    <header className="top"><div className="wrap bar">
      <Link href="/" className="brand"><img src="/logo-nav.jpg" alt="MakeUpBy_Koki" /></Link>
      {!admin && <nav className="dnav">
        {[...TABS, ["/contact", "Contact", null, "Contact"]].map(([h, s, I, l]) => <Link key={h} href={h} className={path === h ? "on" : ""}>{l}</Link>)}
      </nav>}
      {admin ? <Link href="/" className="own">Customer view</Link>
        : <Link href="/admin" className="own"><Lock /><span>Owner</span></Link>}
    </div></header>
    {!admin && <nav className="tabs">
      {TABS.map(([h, s, I]) => <Link key={h} href={h} className={path === h ? "on" : ""}><I />{s}</Link>)}
    </nav>}
  </>);
}
