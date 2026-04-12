import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, ArrowRight, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { HoneypotField } from "@/components/security/HoneypotField";
import { useHoneypot } from "@/hooks/useHoneypot";
import { SEOHead } from "@/components/SEOHead";

// Simple client-side rate limiting
const attempts = new Map<string, number[]>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000; // 1 minute

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const times = (attempts.get(key) || []).filter((t) => now - t < WINDOW_MS);
  attempts.set(key, times);
  if (times.length >= MAX_ATTEMPTS) return true;
  times.push(now);
  attempts.set(key, times);
  return false;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { honeypot, setHoneypot, isBot } = useHoneypot();

  // Track form render time — bots submit instantly
  const formLoadTime = useRef(Date.now());

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Security check 1: Honeypot
    if (isBot()) {
      // Silently reject — don't inform the bot
      toast.success(isLogin ? "Erfolgreich angemeldet!" : "Konto erstellt!");
      return;
    }

    // Security check 2: Timing — reject if submitted in < 2 seconds
    if (Date.now() - formLoadTime.current < 2000) {
      toast.error("Bitte warte einen Moment und versuche es erneut.");
      return;
    }

    // Security check 3: Client-side rate limiting
    if (isRateLimited(email)) {
      toast.error("Zu viele Versuche. Bitte warte eine Minute.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Erfolgreich angemeldet!");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split("@")[0] },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Konto erstellt! Bitte bestätige deine E-Mail-Adresse.");
      }
    } catch (err: any) {
      toast.error(err.message || "Ein Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {isLogin ? "Willkommen zurück" : "Konto erstellen"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Melde dich an, um fortzufahren."
                : "Erstelle ein Konto, um loszulegen."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot — invisible to real users */}
            <HoneypotField value={honeypot} onChange={setHoneypot} />

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Dein Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mindestens 6 Zeichen"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Anmelden" : "Registrieren"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Geschützt durch mehrere Sicherheitsebenen</span>
          </div>

          {/* Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                formLoadTime.current = Date.now();
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? (
                <>Noch kein Konto? <span className="font-medium text-primary">Registrieren</span></>
              ) : (
                <>Bereits ein Konto? <span className="font-medium text-primary">Anmelden</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
