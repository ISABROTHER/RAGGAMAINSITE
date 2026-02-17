import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InitPayload {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  channels: string[];
  metadata?: Record<string, unknown>;
  callback_url: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecret) {
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body: InitPayload = await req.json();
    const { email, amount, currency, reference, channels, metadata, callback_url } = body;

    if (!email || !amount || !reference || !callback_url) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (typeof amount !== "number" || amount < 100) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const initRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount),
          currency: currency || "GHS",
          reference,
          channels: channels || ["card", "mobile_money", "bank_transfer"],
          metadata,
          callback_url,
        }),
        signal: AbortSignal.timeout(15000),
      },
    );

    if (!initRes.ok) {
      const errorBody = await initRes.json().catch(() => null);
      const message = errorBody?.message || "Payment gateway error";
      const statusCode = initRes.status === 401 ? 401 : initRes.status >= 500 ? 502 : 400;
      console.error(`Paystack API error ${initRes.status}: ${message}`);
      return new Response(
        JSON.stringify({
          error: message,
          code: errorBody?.code,
          type: errorBody?.type,
        }),
        {
          status: statusCode,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const initData = await initRes.json();

    if (!initData.status || !initData.data) {
      return new Response(
        JSON.stringify({
          error: initData.message || "Failed to initialize payment",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        authorization_url: initData.data.authorization_url,
        access_code: initData.data.access_code,
        reference: initData.data.reference,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Failed to initialize payment",
        message: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
