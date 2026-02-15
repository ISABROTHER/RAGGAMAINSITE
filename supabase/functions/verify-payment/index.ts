import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface VerificationCache {
  [key: string]: {
    status: string;
    timestamp: number;
  };
}

const verificationCache: VerificationCache = {};
const CACHE_TTL = 300000;

function cleanCache() {
  const now = Date.now();
  for (const [key, value] of Object.entries(verificationCache)) {
    if (now - value.timestamp > CACHE_TTL) {
      delete verificationCache[key];
    }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const body = await req.json();
    const { reference } = body;

    if (!reference || typeof reference !== "string" || reference.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid payment reference format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!/^BK_\d+_[a-f0-9]+$/.test(reference)) {
      return new Response(
        JSON.stringify({ error: "Payment reference format not recognized" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    cleanCache();

    if (verificationCache[reference]) {
      const cached = verificationCache[reference];
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return new Response(
          JSON.stringify({
            verified: true,
            status: cached.status,
            cached: true,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecret) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Payment verification service unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: contribution, error: fetchError } = await supabase
      .from("contributions")
      .select("id, amount_ghs, status, payment_reference")
      .eq("payment_reference", reference)
      .single();

    if (fetchError || !contribution) {
      return new Response(
        JSON.stringify({ error: "Payment reference not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (contribution.status !== "pending") {
      verificationCache[reference] = {
        status: contribution.status,
        timestamp: Date.now(),
      };
      return new Response(
        JSON.stringify({
          verified: true,
          status: contribution.status,
          already_processed: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${paystackSecret}` },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!verifyRes.ok) {
      console.error(`Paystack API error: ${verifyRes.status}`);
      return new Response(
        JSON.stringify({ error: "Payment gateway unavailable" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const verifyData = await verifyRes.json();

    if (!verifyData.status || !verifyData.data) {
      console.error("Invalid Paystack response format");
      return new Response(
        JSON.stringify({ error: "Invalid payment verification response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const paystackStatus = verifyData.data.status;
    const amountPaid = verifyData.data.amount / 100;
    const expectedAmount = parseFloat(contribution.amount_ghs);

    if (Math.abs(amountPaid - expectedAmount) > 0.01) {
      console.warn(`Amount mismatch: expected ${expectedAmount}, got ${amountPaid}`);
      await supabase
        .from("contributions")
        .update({ status: "failed" })
        .eq("payment_reference", reference)
        .eq("status", "pending");

      return new Response(
        JSON.stringify({
          error: "Payment amount mismatch",
          expected: expectedAmount,
          received: amountPaid,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const newStatus = paystackStatus === "success" ? "completed" : "failed";

    const { error: updateError } = await supabase
      .from("contributions")
      .update({ status: newStatus })
      .eq("payment_reference", reference)
      .eq("status", "pending");

    if (updateError) {
      console.error("Database update failed:", updateError.message);
      return new Response(
        JSON.stringify({ error: "Failed to update payment status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    verificationCache[reference] = {
      status: newStatus,
      timestamp: Date.now(),
    };

    const processingTime = Date.now() - startTime;
    console.log(`Payment verified: ${reference} -> ${newStatus} (${processingTime}ms)`);

    return new Response(
      JSON.stringify({
        verified: true,
        status: newStatus,
        paystack_status: paystackStatus,
        amount_verified: true,
        processing_time_ms: processingTime,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Verification error:", err);
    return new Response(
      JSON.stringify({
        error: "Payment verification failed",
        message: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
