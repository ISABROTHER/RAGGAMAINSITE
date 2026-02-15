import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, X-Paystack-Signature",
};

async function verifyPaystackSignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"],
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body),
    );

    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return computedSignature === signature;
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!paystackSecret) {
    console.error("PAYSTACK_SECRET_KEY not configured");
    return new Response(
      JSON.stringify({ error: "Webhook handler not configured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      console.warn("Missing Paystack signature");
      return new Response(
        JSON.stringify({ error: "Missing signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.text();

    const isValid = await verifyPaystackSignature(body, signature, paystackSecret);
    if (!isValid) {
      console.error("Invalid Paystack signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const event = JSON.parse(body);

    if (!event.event || !event.data) {
      return new Response(
        JSON.stringify({ error: "Invalid webhook payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log(`Webhook event: ${event.event}`);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const amountPaid = event.data.amount / 100;

      if (!reference || typeof reference !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid reference" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      const { data: contribution, error: fetchError } = await supabase
        .from("contributions")
        .select("id, amount_ghs, status")
        .eq("payment_reference", reference)
        .single();

      if (fetchError || !contribution) {
        console.warn(`Contribution not found for reference: ${reference}`);
        return new Response(
          JSON.stringify({ error: "Contribution not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (contribution.status === "completed") {
        console.log(`Contribution already completed: ${reference}`);
        return new Response(
          JSON.stringify({ message: "Already processed" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const expectedAmount = parseFloat(contribution.amount_ghs);
      if (Math.abs(amountPaid - expectedAmount) > 0.01) {
        console.error(`Amount mismatch for ${reference}: expected ${expectedAmount}, got ${amountPaid}`);
        await supabase
          .from("contributions")
          .update({ status: "failed" })
          .eq("payment_reference", reference)
          .eq("status", "pending");

        return new Response(
          JSON.stringify({ error: "Amount mismatch", expected: expectedAmount, received: amountPaid }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { error: updateError } = await supabase
        .from("contributions")
        .update({ status: "completed" })
        .eq("payment_reference", reference)
        .eq("status", "pending");

      if (updateError) {
        console.error("Failed to update contribution:", updateError.message);
        return new Response(
          JSON.stringify({ error: "Update failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      console.log(`Payment completed via webhook: ${reference}`);

      return new Response(
        JSON.stringify({ message: "Webhook processed successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ message: "Event acknowledged" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
