import Gallery from "@/components/Gallery";
export const metadata = { title: "Her work – MakeUpBy_Koki" };
export default function Work() {
  return (<div className="wrap" style={{ paddingTop: 24 }}>
    <h2>Her work</h2>
    <p className="stl" style={{ marginTop: 6 }}>Tap a photo to see it bigger.</p>
    <div className="sh" style={{ marginTop: 20 }}><h2 style={{ fontSize: "1.6rem" }}>Makeup</h2><a href="/book">Book makeup →</a></div>
    <Gallery />
  </div>);
}
