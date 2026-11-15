import { supabase } from "@/lib/supabase";
import MatricCards from "@/components/MatricCards";
export const dynamic = "force-dynamic";
export const metadata = { title: "Matric dance packages – MakeUpBy_Koki" };

export default async function Matric() {
  const { data } = await supabase.from("services").select("*").eq("category", "Matric dance").order("sort");
  return (
    <div className="wrap" style={{ paddingTop: 24 }}>
      <h2>Matric dance packages</h2>
      <p className="stl" style={{ marginTop: 6 }}>Full glam and hair in one booking. Swipe to see each package.</p>
      <MatricCards packages={data || []} />
    </div>
  );
}
