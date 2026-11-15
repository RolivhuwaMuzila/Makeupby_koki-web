import { Wa, Phone, Ig, Fb } from "./Icons";
import { WA, PHONE, FACEBOOK, INSTAGRAM } from "@/lib/links";
export default function ContactRows() {
  const rows = [
    [`https://wa.me/${WA}`, "WhatsApp", "Chat with Koki", "#25D366", Wa],
    [`tel:+${PHONE}`, "Call", "079 462 9524", "var(--teal)", Phone],
    [INSTAGRAM, "Instagram", "@makeupby_koki", "var(--pink)", Ig],
    [FACEBOOK, "Facebook", "Makeupby_koki", "#1877f2", Fb],
  ];
  return rows.map(([href, name, sub, bg, I]) => (
    <a key={name} className="crow" href={href} target="_blank" rel="noopener noreferrer">
      <span className="ico" style={{ background: bg }}><I /></span>
      <span><b>{name}</b><small>{sub}</small></span>
    </a>));
}
