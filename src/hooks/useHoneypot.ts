import { useState, useCallback } from "react";

/**
 * Honeypot anti-bot hook.
 * Renders an invisible field that real users never fill in.
 * If a bot fills it, `isBot` returns true.
 */
export function useHoneypot() {
  const [honeypot, setHoneypot] = useState("");

  const isBot = useCallback(() => {
    return honeypot.length > 0;
  }, [honeypot]);

  return { honeypot, setHoneypot, isBot };
}
