"use client";
import { useState } from "react";
import { R } from "@/lib/links";

const pad = (n) => String(n).padStart(2, "0");
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };

export default function Admin() {
  const [key, setKey] = useState(""); const [d, setD] = useState(null); const [err, setErr] = useState("");
  const [tab, setTab] = useState("today"); const [msg, setMsg] = useState("");
  const [np, setNp] = useState({ closure: "", length: "", price: "", stock: "20" });
  const [ns, setNs] = useState({ name: "", price: "", deposit: "50", category: "Makeup", description: "" });

  async function load(k = key) {
    const r = await fetch("/api/admin", { headers: { "x-admin-key": k } }); const j = await r.json();
    if (j.error) setErr(j.error); else { setD(j); setErr(""); }
  }
  async function act(table, id, values, done) {
    await fetch("/api/admin", { method: "POST", headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ action: id ? "update" : "insert", id, data: { table, values } }) });
    if (done) { setMsg(done); setTimeout(() => setMsg(""), 2000); }
    load();
  }

  if (!d) return (
    <div className="wrap" style={{ paddingTop: 40, maxWidth: 420, textAlign: "center" }}>
      <h2>Owner login</h2><p className="stl">Only Koki can open this part.</p>
      <form onSubmit={e => { e.preventDefault(); load(); }}>
        <input type="password" placeholder="Password" onChange={e => setKey(e.target.value)} />
        {err && <p className="err">{err}</p>}
        <button className="btn" style={{ width: "100%" }}>Open my dashboard</button>
      </form>
    </div>);

  const t = todayStr(), weekAgo = Date.now() - 7 * 864e5;
  const todays = d.bookings.filter(b => b.booking_date === t).sort((a, b) => a.booking_time.localeCompare(b.booking_time));
  const coming = d.bookings.filter(b => b.booking_date > t && b.status === "confirmed")
    .sort((a, b) => (a.booking_date + a.booking_time).localeCompare(b.booking_date + b.booking_time));
  const toShip = d.orders.filter(o => o.status === "paid");
  const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
  const week = sum(d.bookings.filter(b => new Date(b.created_at) > weekAgo), b => b.amount_cents) + sum(d.orders.filter(o => new Date(o.created_at) > weekAgo), o => o.total_cents);
  const stats = [["Booked today", todays.filter(b => b.status === "confirmed").length], ["Deposits today", R(sum(todays, b => b.amount_cents))],
    ["Wigs to ship", toShip.length], ["Last 7 days", R(week)]];

  const Appt = ({ b }) => (
    <div className="ap"><time>{b.booking_time}</time>
      <div><b>{b.customer_name}</b><small>{b.services?.name} · {R(b.amount_cents)} paid · {b.customer_phone}{b.booking_date !== t ? " · " + b.booking_date : ""}</small></div>
      {b.status === "confirmed" ? <button className="btn sm" onClick={() => act("booking", b.id, { status: "completed" }, "Marked as done")}>Done</button> : <span className="tag g">{b.status}</span>}
    </div>);

  return (<>
    <div className="ohead"><div className="wrap">
      <p>Welcome back</p><h1>Koki’s studio</h1>
      <div className="stats">{stats.map(([l, v]) => <div className="stat" key={l}><small>{l}</small><b>{v}</b></div>)}</div>
    </div></div>
    <div className="wrap">
      <div className="seg">{[["today", "Bookings"], ["orders", "Wig orders"], ["catalog", "Catalog"]].map(([k, l]) =>
        <button key={k} className={"pill " + (tab === k ? "on" : "")} onClick={() => setTab(k)}>{l}</button>)}</div>
      {msg && <p className="tag" style={{ marginBottom: 10 }}>{msg}</p>}

      {tab === "today" && <>
        <h3 style={{ margin: "6px 0 10px" }}>Today</h3>
        <div className="card">{todays.length ? todays.map(b => <Appt key={b.id} b={b} />) : <p className="stl" style={{ padding: "14px 0", margin: 0 }}>No bookings today.</p>}</div>
        <h3 style={{ margin: "18px 0 10px" }}>Coming up</h3>
        <div className="card">{coming.length ? coming.map(b => <Appt key={b.id} b={b} />) : <p className="stl" style={{ padding: "14px 0", margin: 0 }}>Nothing booked yet.</p>}</div>
      </>}

      {tab === "orders" && <div className="card">{d.orders.length ? d.orders.map(o => (
        <div className="ap" key={o.id}>
          <div><b>{o.customer_name}</b><small>{o.items.map(i => `${i.name} × ${i.qty}`).join(", ")} · {R(o.total_cents)}</small>
            <small>{o.customer_phone} · {o.delivery_address}</small></div>
          {o.status === "paid" ? <button className="btn sm" onClick={() => act("order", o.id, { status: "shipped" }, "Marked as shipped")}>Mark shipped</button> : <span className="tag">{o.status}</span>}
        </div>)) : <p className="stl" style={{ padding: "14px 0", margin: 0 }}>No paid orders yet.</p>}</div>}

      {tab === "catalog" && <>
        <h3 style={{ margin: "6px 0 10px" }}>Wig stock</h3>
        <div className="card">{d.products.map(p => (
          <div className="ap" key={p.id}><div><b>{p.name}</b><small>{R(p.price_cents)}{p.active ? "" : " · hidden"}</small></div>
            <div className="step"><button onClick={() => act("product", p.id, { stock: Math.max(0, p.stock - 1) })}>−</button><b>{p.stock}</b><button onClick={() => act("product", p.id, { stock: p.stock + 1 })}>+</button></div>
            <button className="btn o sm" onClick={() => act("product", p.id, { active: !p.active })}>{p.active ? "Hide" : "Show"}</button></div>))}</div>

        <h3 style={{ margin: "18px 0 10px" }}>Add a wig</h3>
        <form className="card" style={{ padding: 18 }} onSubmit={e => { e.preventDefault();
          act("product", null, { name: `Glueless bob straight, ${np.closure} closure, ${np.length} inch`, description: "Pre-order only. Customised.", closure: np.closure, length_in: +np.length, price_cents: Math.round(np.price * 100), stock: +np.stock }, "Wig added"); }}>
          <input required placeholder="Closure, e.g. 4x4" onChange={e => setNp({ ...np, closure: e.target.value })} />
          <input required type="number" placeholder="Length in inches" onChange={e => setNp({ ...np, length: e.target.value })} />
          <input required type="number" placeholder="Price in rands" onChange={e => setNp({ ...np, price: e.target.value })} />
          <input required type="number" placeholder="Stock" value={np.stock} onChange={e => setNp({ ...np, stock: e.target.value })} />
          <button className="btn">Add wig</button></form>

        <h3 style={{ margin: "18px 0 10px" }}>Services</h3>
        <div className="card">{d.services.map(s => (
          <div className="ap" key={s.id}><div><b>{s.name}</b><small>{s.category} · {R(s.price_cents)} · {s.deposit_percent}% deposit{s.active ? "" : " · hidden"}</small></div>
            <button className="btn o sm" onClick={() => act("service", s.id, { active: !s.active })}>{s.active ? "Hide" : "Show"}</button></div>))}</div>

        <h3 style={{ margin: "18px 0 10px" }}>Add a service</h3>
        <form className="card" style={{ padding: 18 }} onSubmit={e => { e.preventDefault();
          act("service", null, { name: ns.name, description: ns.description, price_cents: Math.round(ns.price * 100), deposit_percent: +ns.deposit, category: ns.category, sort: 200 }, "Service added"); }}>
          <input required placeholder="Name" onChange={e => setNs({ ...ns, name: e.target.value })} />
          <select value={ns.category} onChange={e => setNs({ ...ns, category: e.target.value })}>{["Makeup", "Bridal", "Hair", "Matric dance"].map(c => <option key={c}>{c}</option>)}</select>
          <input required type="number" placeholder="Price in rands" onChange={e => setNs({ ...ns, price: e.target.value })} />
          <input required type="number" placeholder="Deposit %" value={ns.deposit} onChange={e => setNs({ ...ns, deposit: e.target.value })} />
          <button className="btn">Add service</button></form>
      </>}
      <p style={{ textAlign: "center", margin: "24px 0" }}><button className="btn o sm" onClick={() => load()}>Refresh</button></p>
    </div>
  </>);
}
