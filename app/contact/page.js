import ContactRows from "@/components/ContactRows";
export const metadata = { title: "Contact – MakeUpBy_Koki" };
export default function Contact() {
  return (<div className="wrap" style={{ paddingTop: 24, maxWidth: 620 }}>
    <h2>Say hello</h2>
    <p className="stl" style={{ marginTop: 6 }}>Makeup Artist · Roodepoort, Florida</p>
    <ContactRows />
  </div>);
}
