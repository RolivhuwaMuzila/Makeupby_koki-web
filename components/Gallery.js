"use client";
import { useState } from "react";
const MAKEUP = [1, 2, 3, 4, 5, 6, 7];
const WIGS = [[8, "9x6 Lagos hairline installation, before the melt"], [9, "Choose a middle or side part at no extra cost"], [10, "Sleek straight wig install"]];
export default function Gallery() {
  const [open, setOpen] = useState(null);
  return (<>
    <div className="gal">{MAKEUP.map(n => (
      <figure key={n} onClick={() => setOpen(n)}><img src={`/work-${n}.jpg`} alt="Makeup by Koki" loading="lazy" /></figure>))}</div>
    <div className="sh"><h2 style={{ fontSize: "1.6rem" }}>Wig installation</h2><a href="/book">Book installation →</a></div>
    <div className="gal w">{WIGS.map(([n, c]) => (
      <figure key={n} onClick={() => setOpen(n)}><img src={`/work-${n}.jpg`} alt="Wig installation by Koki" loading="lazy" /><figcaption>{c}</figcaption></figure>))}</div>
    {open && <div className="lb" onClick={() => setOpen(null)}><img src={`/work-${open}.jpg`} alt="" /><button>Close</button></div>}
  </>);
}
