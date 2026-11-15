import Link from "next/link";
export default function ThankYou() {
  return (<div className="wrap" style={{ paddingTop: 30 }}>
    <div className="done"><h3>Thank you, your payment is being confirmed.</h3>
      <p style={{ color: "var(--mute)" }}>You will hear from Koki on WhatsApp shortly. Keep your reference handy.</p>
      <Link href="/" className="btn sm" style={{ width: "max-content" }}>Back home</Link></div>
  </div>);
}
