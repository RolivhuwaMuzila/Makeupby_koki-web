"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { R } from "@/lib/links";

const CATS = ["Makeup", "Bridal", "Hair", "Matric dance"];
const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]; // keep the same as app/api/slots/route.js
const DN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function Book() {
  const [services, setServices] = useState([]); const [days, setDays] = useState([]);
  const [step, setStep] = useState(1); const [cat, setCat] = useState("Makeup");
  const [svc, setSvc] = useState(null); const [date, setDate] = useState(""); const [time, setTime] = useState("");
  const [free, setFree] = useState(HOURS); const [f, setF] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");

  useEffect(() => {
    setDays([...Array(10)].map((_, i) => { const d = new Date(Date.now() + i * 864e5); return { k: key(d), w: DN[d.getDay()], n: d.getDate() }; }));
    supabase.from("services").select("*").order("sort").then(({ data }) => {
      setServices(data || []);
      const id = new URLSearchParams(window.location.search).get("svc");
      const s = (data || []).find(x => x.id === id);
      if (s) { setSvc(s); setCat(s.category); setStep(2); }
    });
  }, []);
  useEffect(() => {
    if (date) fetch(`/api/slots?date=${date}`).then(r => r.json()).then(s => { setFree(s); setTime(""); });
  }, [date]);

  const deposit = svc ? Math.round(svc.price_cents * svc.deposit_percent / 100) : 0;
  const ok = step === 1 ? !!svc : step === 2 ? date && time : f.name && f.email && f.phone;
  async function next() {
    if (step < 3) { setStep(step + 1); window.scrollTo(0, 0); return; }
    setBusy(true); setErr("");
    const res = await fetch("/api/pay/booking", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: svc.id, date, time, ...f }) });
    const j = await res.json();
    if (j.url) window.location.href = j.url; else { setErr(j.error || "Something went wrong"); setBusy(false); setStep(2); }
  }

  return (<div className="wrap" style={{ paddingTop: 24 }}>
    <h2>Book your glam</h2>
    <div className="prog">{[1, 2, 3].map(i => <i key={i} className={i <= step ? "on" : ""} />)}</div>
    <div className="stl">Step {step} of 3 · {["Choose your service", "Pick a day and time", "Your details"][step - 1]}</div>

    {step === 1 && <>
      <div className="pills">{CATS.map(c => <button key={c} className={"pill " + (c === cat ? "on" : "")} onClick={() => setCat(c)}>{c}</button>)}</div>
      <div className="tiles">{services.filter(s => s.category === cat).map(s => (
        <button key={s.id} className={"tile " + (svc?.id === s.id ? "on" : "")} onClick={() => setSvc(s)}>{s.name}<b>{R(s.price_cents)}{s.price_from ? "+" : ""}</b></button>))}</div>
    </>}

    {step === 2 && <>
      <div className="days">{days.map(d => <button key={d.k} className={"day " + (d.k === date ? "on" : "")} onClick={() => setDate(d.k)}><small>{d.w}</small>{d.n}</button>)}</div>
      {date ? <div className="pills">{HOURS.map(t => <button key={t} className={"pill " + (t === time ? "on" : "")} disabled={!free.includes(t)} onClick={() => setTime(t)}>{t}</button>)}</div>
        : <p className="stl">Pick a day to see free times.</p>}
    </>}

    {step === 3 && <>
      <input placeholder="Full name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
      <input type="email" placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
      <input placeholder="WhatsApp number" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
      {err && <p className="err">{err}</p>}
    </>}
    {step < 3 && err && <p className="err">{err}</p>}

    <div className="act">
      <div><small>{svc ? svc.name + " · deposit due now" : "Choose a service"}</small><strong>{R(deposit)}</strong></div>
      <div>{step > 1 && <button className="btn o sm" onClick={() => setStep(step - 1)}>Back</button>}
        <button className="btn sm" disabled={!ok || busy} onClick={next}>{busy ? "One moment..." : step === 3 ? "Pay deposit" : "Next"}</button></div>
    </div>
  </div>);
}
