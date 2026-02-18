import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// ──────────────────────────────────────────────────────────
// Supabase Edge Function: send-sms
// Proxies SMS requests to SMSOnlineGH (Zenoph Technologies)
//
// SETUP — run these commands once:
//   supabase secrets set SMSONLINEGH_API_KEY=837ed4722eec8fd2949a9006bec5cc82ee9a7c1e68fa2dc28fc2822d150d12ca
//   supabase secrets set SMS_SENDER_NAME=YourSenderID
//
// DEPLOY:
//   supabase functions deploy send-sms
// ──────────────────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ── Auth ──────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only admin or assemblyman can send SMS
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "assemblyman"].includes(profile.role)) {
      return new Response(
        JSON.stringify({ success: false, error: "Insufficient permissions" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Parse request ────────────────────────────────────
    const { recipients, message, senderName } = await req.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No recipients provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No message provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Prepare SMSOnlineGH call ─────────────────────────
    const apiKey = Deno.env.get("SMSONLINEGH_API_KEY");
    const defaultSender = Deno.env.get("SMS_SENDER_NAME") || "CCN Admin";

    if (!apiKey) {
      console.error("[send-sms] SMSONLINEGH_API_KEY not set");
      return new Response(
        JSON.stringify({ success: false, error: "SMS service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Recipients can be string[] or {phone, name}[]
    const destinations: string[] = recipients
      .map((r: any) => (typeof r === "string" ? r : r.phone))
      .filter(Boolean);

    // SMSOnlineGH v5 REST API
    // https://dev.smsonlinegh.com/docs/v5/http/rest/messaging/sms_non_personalised.html
    const smsPayload = {
      messages: [
        {
          text: message.trim(),
          type: 0,  // GSM default encoding
          sender: senderName || defaultSender,
          destinations: destinations,
        },
      ],
    };

    console.log(`[send-sms] Sending to ${destinations.length} recipients`);

    const smsResponse = await fetch("https://api.smsonlinegh.com/v5/message/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Host": "api.smsonlinegh.com",
        "Authorization": `key ${apiKey}`,
      },
      body: JSON.stringify(smsPayload),
    });

    const smsResult = await smsResponse.json();
    console.log(`[send-sms] Response: ${smsResponse.status}`, JSON.stringify(smsResult));

    // ── Process response ─────────────────────────────────
    // SMSOnlineGH returns handshake.label === "HSHK_OK" on success
    const isSuccess = smsResult?.handshake?.label === "HSHK_OK";

    if (isSuccess) {
      // Log each SMS to messages table for history
      const logRows = destinations.map((phone: string) => {
        const match = recipients.find((r: any) =>
          (typeof r === "string" ? r : r.phone) === phone
        );
        const name = typeof match === "object" ? match.name : phone;
        return {
          sender_id: user.id,
          recipient_id: null,
          subject: phone,
          body: `${message}||NAME||${name}`,
          message_type: "sms",
          priority: "sent",
        };
      });

      await supabase.from("messages").insert(logRows);

      return new Response(
        JSON.stringify({
          success: true,
          sent: destinations.length,
          batch: smsResult?.data?.batch || null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      const errorLabel = smsResult?.handshake?.label || "Unknown error";
      console.error(`[send-sms] Gateway error: ${errorLabel}`);

      return new Response(
        JSON.stringify({ success: false, error: `SMS gateway: ${errorLabel}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("[send-sms] Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});