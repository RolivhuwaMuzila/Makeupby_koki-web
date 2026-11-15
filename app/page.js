import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { R } from "@/lib/links";
import ContactRows from "@/components/ContactRows";
export const dynamic = "force-dynamic";

const COL = { Makeup: "var(--teal)", Bridal: "var(--pink)", Hair: "var(--sun)" };
const TITLE = { Makeup: "Makeup services", Bridal: "Bridal makeup", Hair: "Hair services" };
const WIGS = [[8, "9x6 Lagos hairline installation, before the melt"], [9, "Choose a middle or side part at no extra cost"], [10, "Sleek straight wig install"]];

export default async function Home() {
  const { data } = await supabase.from("services").select("*").order("sort");
  const sv = data || [];
  const chips = ["Soft glam", "Full glam", "Bridal", "Installation", "Matric Gold", "Wig construction"]
    .map(n => sv.find(s => s.name === n)).filter(Boolean);
  return (
    <div className="wrap">
      <div className="hero"><div className="in">
        <div>
          <h1>Make up is <span className="art">ART.</span> Beauty is Spirit!</h1>
          <p className="lead">Makeup, bridal and customised wigs by Koki in Roodepoort, Florida. Choose a time, pay a small deposit, and show up glowing.</p>
          <Link href="/book" className="btn">Book now</Link><Link href="/matric" className="btn o">Matric packages</Link>
          <div className="trust"><span>25K+ followers on Facebook</span><span>Deposit secures your slot</span></div>
        </div>
        <div className="vis"><img className="v1" src="/work-1.jpg" alt="Makeup by Koki" /><img className="v2" src="/work-4.jpg" alt="Makeup by Koki" /></div>
      </div></div>

      <div className="sh"><h2>Book in one tap</h2></div>
      <div className="chips">{chips.map(s => <Link key={s.id} href={`/book?svc=${s.id}`} className="chip">{s.name} · {R(s.price_cents)}</Link>)}</div>

      <div className="sh"><h2>Her makeup</h2><Link href="/work">See all work →</Link></div>
      <div className="rail">{[1, 2, 3, 4, 5, 6, 7].map(n => (
        <Link key={n} href="/work" className="gl"><img src={`/work-${n}.jpg`} alt="Makeup by Koki" /></Link>))}</div>

      <div className="sh"><h2>Wig installation</h2><Link href="/work">See all →</Link></div>
      <div className="rail">{WIGS.map(([n, c]) => (
        <Link key={n} href="/work" className="gl wide"><img src={`/work-${n}.jpg`} alt="Wig installation by Koki" /><span>{c}</span></Link>))}</div>

      <div className="sh"><h2>How it works</h2></div>
      <div className="steps">
        <div><b>1</b><h3 style={{ fontSize: "1.2rem" }}>Choose</h3><p>Pick a service and a day that suits you.</p></div>
        <div><b>2</b><h3 style={{ fontSize: "1.2rem" }}>Pay a deposit</h3><p>Secure your slot safely online. The balance is paid at your appointment.</p></div>
        <div><b>3</b><h3 style={{ fontSize: "1.2rem" }}>Glow</h3><p>Arrive, relax and leave feeling unstoppable.</p></div>
      </div>

      <div className="sh"><h2>Full pricelist</h2></div>
      <p className="stl">Effective from 1 March 2026. A + means the price starts there.</p>
      {["Makeup", "Bridal", "Hair"].map((g, i) => (
        <details key={g} open={i === 0} style={{ "--c": COL[g] }}>
          <summary>{TITLE[g]}</summary>
          {sv.filter(s => s.category === g).map(s => (
            <div className="it" key={s.id}><span>{s.name}</span><b>{R(s.price_cents)}{s.price_from ? "+" : ""}</b></div>))}
        </details>))}

      <div className="sh"><h2>Say hello</h2></div>
      <ContactRows />
    </div>
  );
}
