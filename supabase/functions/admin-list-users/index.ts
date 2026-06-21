import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.slice(7);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    const anonClient = createClient(SUPABASE_URL, ANON);
    const { data: userRes, error: userErr } = await anonClient.auth.getUser(token);
    if (userErr || !userRes.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: hasAdmin, error: roleErr } = await admin.rpc("has_role", {
      _user_id: userRes.user.id,
      _role: "admin",
    });
    if (roleErr || !hasAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch auth.users via admin API (paginated)
    const users: any[] = [];
    let page = 1;
    const perPage = 200;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      users.push(...data.users);
      if (data.users.length < perPage) break;
      page++;
      if (page > 25) break; // safety
    }

    const userIds = users.map((u) => u.id);
    const emails = users.map((u) => u.email).filter(Boolean) as string[];

    const [profilesRes, rolesRes, ordersRes] = await Promise.all([
      admin.from("profiles").select("user_id, display_name, avatar_url, location").in("user_id", userIds),
      admin.from("user_roles").select("user_id, role").in("user_id", userIds),
      admin.from("orders").select("customer_email").in("customer_email", emails),
    ]);

    const profilesByUser = new Map<string, any>();
    (profilesRes.data ?? []).forEach((p) => profilesByUser.set(p.user_id, p));
    const roleByUser = new Map<string, string>();
    (rolesRes.data ?? []).forEach((r) => roleByUser.set(r.user_id, r.role));
    const orderCountByEmail = new Map<string, number>();
    (ordersRes.data ?? []).forEach((o: any) => {
      const e = (o.customer_email || "").toLowerCase();
      if (!e) return;
      orderCountByEmail.set(e, (orderCountByEmail.get(e) ?? 0) + 1);
    });

    const result = users.map((u) => {
      const profile = profilesByUser.get(u.id);
      const emailLower = (u.email || "").toLowerCase();
      return {
        user_id: u.id,
        email: u.email ?? null,
        phone: u.phone ?? null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        email_confirmed_at: u.email_confirmed_at ?? null,
        display_name: profile?.display_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
        location: profile?.location ?? null,
        role: roleByUser.get(u.id) ?? "none",
        order_count: orderCountByEmail.get(emailLower) ?? 0,
      };
    });

    result.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return new Response(JSON.stringify({ users: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-list-users error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
