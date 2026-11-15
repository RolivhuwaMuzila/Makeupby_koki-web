"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { R, WA } from "@/lib/links";

export default function Shop() {
  const [products, setProducts] = useState([]); const [len, setLen] = useState(null); const [cart, setCart] = useState({});
  const [f, setF] = useState({ name: "", email: "", phone: "", address: "" });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  useEffect(() => {
    supabase.from("products").select("*").gt("stock", 0).order("price_cents").then(({ data }) => {
      setProducts(data || []);
      const ls = [...new Set((data || []).map(p => p.length_in).filter(Boolean))].sort((a, b) => a - b);
      if (ls.length) setLen(ls[ls.length - 1]);
    });
  }, []);
  const lengths = [...new Set(products.map(p => p.length_in).filter(Boolean))].sort((a, b) => a - b);
  const shown = products.filter(p => !len || !p.length_in || p.length_in === len);
  const add = p => setCart(c => ({ ...c, [p.id]: Math.min((c[p.id] || 0) + 1, p.stock) }));
  const remove = p => setCart(c => { const n = { ...c }; n[p.id] > 1 ? n[p.id]-- : delete n[p.id]; return n; });
  const lines = products.filter(p => cart[p.id]);
  const total = lines.reduce((s, p) => s + p.price_cents * cart[p.id], 0);
  async function checkout(e) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await fetch("/api/pay/order", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, items: lines.map(p => ({ id: p.id, qty: cart[p.id] })) }) });
    const j = await res.json();
    if (j.url) window.location.href = j.url; else { setErr(j.error || "Something went wrong"); setBusy(false); }
  }
  return (<div className="wrap" style={{ paddingTop: 24 }}>
    <h2>Glueless bob wigs</h2>
    <p className="stl" style={{ marginTop: 6 }}>Straight hair, pre-order only, every wig customised. A 2 month payment option is available on <a href={`https://wa.me/${WA}`} style={{ textDecoration: "underline" }}>WhatsApp</a>.</p>
    <div className="pills">{lengths.map(l => <button key={l} className={"pill " + (l === len ? "on" : "")} onClick={() => setLen(l)}>{l} inch</button>)}</div>
    <div className="tiles" style={{ maxWidth: 760 }}>{shown.map(p => (
      <button key={p.id} className="tile" onClick={() => add(p)}>{p.closure ? p.closure + " closure" : p.name}<b>{R(p.price_cents)}</b><small>Tap to add</small></button>))}</div>
    <p className="stl" style={{ marginTop: 10, fontSize: ".84rem" }}>HD closures are only available in 10 inch.</p>
    {lines.length > 0 && <form className="bag" onSubmit={checkout}>
      <h3>Your pre-order</h3>
      {lines.map(p => <div className="row" key={p.id}><span>{p.name} × {cart[p.id]}</span>
        <span><button type="button" onClick={() => remove(p)}>−</button> {R(p.price_cents * cart[p.id])}</span></div>)}
      <div className="row"><b>Total</b><b>{R(total)}</b></div><br />
      <input required placeholder="Full name" onChange={e => setF({ ...f, name: e.target.value })} />
      <input required type="email" placeholder="Email" onChange={e => setF({ ...f, email: e.target.value })} />
      <input required placeholder="WhatsApp number" onChange={e => setF({ ...f, phone: e.target.value })} />
      <input required placeholder="Delivery address" onChange={e => setF({ ...f, address: e.target.value })} />
      {err && <p className="err">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "One moment..." : "Pay securely"}</button>
    </form>}
  </div>);
}
