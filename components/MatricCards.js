"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { R } from "@/lib/links";

const MC = ["#b0763c", "#9aa3ad", "#d4a017", "#7d8597"]; // bronze, silver, gold, platinum

export default function MatricCards({ packages }) {
  const ref = useRef(null);
  const [on, setOn] = useState(0);
  const onScroll = () => {
    const el = ref.current;
    if (!el || !el.children[0]) return;
    const w = el.children[0].offsetWidth + 14;
    setOn(Math.max(0, Math.min(packages.length - 1, Math.round(el.scrollLeft / w))));
  };
  const go = (i) => ref.current?.children[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

  return (<>
    <div className="mcar" ref={ref} onScroll={onScroll}>
      {packages.map((m, i) => {
        const tier = m.name.replace("Matric ", "");
        return (
          <div className="pc" key={m.id} style={{ "--c": MC[i % 4] }}>
            <div className="pcimg">
              <img src={`/matric-${i + 1}.jpg`} alt={`${tier} package look`} />
              <h3>{tier}</h3><b>{R(m.price_cents)}</b>
            </div>
            <div className="bd">
              <ul>{(m.description || "").split("|").map(x => <li key={x}>{x}</li>)}</ul>
              <p>{m.note}</p>
              <Link href={`/book?svc=${m.id}`} className="btn">Book {tier}</Link>
            </div>
          </div>);
      })}
    </div>
    <div className="dots">{packages.map((_, i) => <i key={i} className={i === on ? "on" : ""} />)}</div>

    <div className="sh"><h2 style={{ fontSize: "1.6rem" }}>Which one is for me?</h2></div>
    <div className="help">
      <div onClick={() => go(0)}><i style={{ background: MC[0] }} /><span><b>I already have my wig</b><br /><small style={{ color: "var(--mute)" }}>Bronze or Silver. Your wig must be customised.</small></span></div>
      <div onClick={() => go(2)}><i style={{ background: MC[2] }} /><span><b>I need a wig too</b><br /><small style={{ color: "var(--mute)" }}>Gold includes a 20 inch customised wig. Platinum includes a 24 inch one.</small></span></div>
    </div>
  </>);
}
