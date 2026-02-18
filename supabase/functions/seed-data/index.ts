import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results: string[] = [];

    const { error: triggerError } = await supabaseAdmin.rpc("exec_sql", {
      sql_text: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, full_name, role)
          VALUES (
            NEW.id,
            COALESCE(NEW.email, ''),
            COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
            'constituent'
          )
          ON CONFLICT (id) DO NOTHING;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `,
    });

    if (triggerError) {
      results.push(`Trigger via RPC failed: ${triggerError.message}, trying direct SQL...`);

      const { error: sqlErr } = await supabaseAdmin.from("_exec").select("*").limit(0);
      results.push(`Direct approach needed: ${sqlErr?.message || "ok"}`);
    } else {
      results.push("Trigger created successfully");
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: "89b96cf2-7bb5-47b2-9e9e-d4f1b7ab9d24",
          email: "office@kmnragga.com",
          full_name: "KMN Ragga",
          phone: "",
          role: "admin",
          is_active: true,
        },
        { onConflict: "id" }
      );

    results.push(
      profileError
        ? `Profile error: ${profileError.message}`
        : "Admin profile created"
    );

    const projectId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

    const { error: projectError } = await supabaseAdmin
      .from("projects")
      .upsert(
        {
          id: projectId,
          title: "Obiara Ka Ho Exercise Book Project",
          slug: "obiara-ka-ho-exercise-books",
          description:
            "Education is the foundation of our future. In Cape Coast North, too many brilliant students struggle simply because they lack basic learning materials. Hon. Dr. Kwamena Minta Nyarku (Ragga) launched the Obiara Ka Ho Exercise Book Project to ensure that every child in the constituency has the exercise books they need to succeed in class.",
          category: "Education",
          image_url:
            "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1200",
          target_units: 0,
          unit_label: "books",
          unit_price_ghs: 2.0,
          is_active: true,
          is_featured: true,
        },
        { onConflict: "slug" }
      );

    results.push(
      projectError
        ? `Project error: ${projectError.message}`
        : "Exercise Book project created"
    );

    const contributions = [
      { fn: "Grace", ln: "Keeling", contact: "0241234567", amt: 1000, units: 500, ref: "PAY-SEED-001", method: "MOMO", ago: 2 * 24 * 60 },
      { fn: "Peter", ln: "Castro", contact: "0249876543", amt: 152, units: 76, ref: "PAY-SEED-002", method: "MOMO", ago: 60 },
      { fn: "Kelsada", ln: "Taylor", contact: "0551234567", amt: 20, units: 10, ref: "PAY-SEED-003", method: "MOMO", ago: 31 },
      { fn: "Kwame", ln: "Mensah", contact: "0201234567", amt: 40, units: 20, ref: "PAY-SEED-004", method: "MOMO", ago: 45 },
      { fn: "Ama", ln: "Darko", contact: "0271234567", amt: 100, units: 50, ref: "PAY-SEED-005", method: "CARD", ago: 180 },
      { fn: "Kofi", ln: "Asante", contact: "0541234567", amt: 60, units: 30, ref: "PAY-SEED-006", method: "MOMO", ago: 300 },
      { fn: "Abena", ln: "Osei", contact: "0261234567", amt: 200, units: 100, ref: "PAY-SEED-007", method: "CARD", ago: 480 },
      { fn: "Yaw", ln: "Boateng", contact: "0501234567", amt: 30, units: 15, ref: "PAY-SEED-008", method: "MOMO", ago: 720 },
      { fn: "Efua", ln: "Mensah", contact: "0241112233", amt: 500, units: 250, ref: "PAY-SEED-009", method: "CARD", ago: 1440 },
      { fn: "Samuel", ln: "Adu", contact: "0209876543", amt: 80, units: 40, ref: "PAY-SEED-010", method: "MOMO", ago: 1560 },
      { fn: "Adjoa", ln: "Nyarko", contact: "0551112233", amt: 400, units: 200, ref: "PAY-SEED-011", method: "MOMO", ago: 1740 },
      { fn: "Emmanuel", ln: "Tetteh", contact: "0249998877", amt: 50, units: 25, ref: "PAY-SEED-012", method: "MOMO", ago: 2880 },
      { fn: "Akua", ln: "Appiah", contact: "0201119988", amt: 300, units: 150, ref: "PAY-SEED-013", method: "CARD", ago: 3060 },
      { fn: "Daniel", ln: "Owusu", contact: "0549991122", amt: 120, units: 60, ref: "PAY-SEED-014", method: "MOMO", ago: 4320 },
      { fn: "Felicia", ln: "Amoah", contact: "0241223344", amt: 70, units: 35, ref: "PAY-SEED-015", method: "MOMO", ago: 4560 },
      { fn: "Joseph", ln: "Quayson", contact: "0271223344", amt: 600, units: 300, ref: "PAY-SEED-016", method: "CARD", ago: 5760 },
      { fn: "Mary", ln: "Ansah", contact: "0501223344", amt: 90, units: 45, ref: "PAY-SEED-017", method: "MOMO", ago: 6120 },
      { fn: "Isaac", ln: "Bonsu", contact: "0241334455", amt: 160, units: 80, ref: "PAY-SEED-018", method: "MOMO", ago: 7200 },
      { fn: "Comfort", ln: "Essien", contact: "0551334455", amt: 240, units: 120, ref: "PAY-SEED-019", method: "CARD", ago: 7680 },
      { fn: "Francis", ln: "Gyasi", contact: "0209912345", amt: 44, units: 22, ref: "PAY-SEED-020", method: "MOMO", ago: 8640 },
    ];

    const contribRows = contributions.map((c) => ({
      project_id: projectId,
      donor_first_name: c.fn,
      donor_last_name: c.ln,
      donor_contact: c.contact,
      amount_ghs: c.amt,
      units_contributed: c.units,
      payment_reference: c.ref,
      payment_method: c.method,
      status: "completed",
      created_at: new Date(Date.now() - c.ago * 60000).toISOString(),
    }));

    const { error: contribError } = await supabaseAdmin
      .from("contributions")
      .upsert(contribRows, { onConflict: "payment_reference" });

    results.push(
      contribError
        ? `Contributions error: ${contribError.message}`
        : `${contribRows.length} contributions seeded`
    );

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});