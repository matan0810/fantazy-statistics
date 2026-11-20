import { useEffect, useReducer } from "react";

// Captures the browser's "install app" prompt so we can trigger it from our
// own button, and tracks whether we're already running as an installed app.
let deferred = null;
let installed = false;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installed = true;
    notify();
  });
}

const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export function useInstall() {
  const [, force] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    listeners.add(force);
    return () => listeners.delete(force);
  }, []);

  return {
    canPrompt: Boolean(deferred),
    installed: installed || isStandalone(),
    ios: isIOS(),
    prompt: async () => {
      if (!deferred) return "unavailable";
      deferred.prompt();
      const choice = await deferred.userChoice.catch(() => ({ outcome: "dismissed" }));
      deferred = null;
      notify();
      return choice.outcome;
    },
  };
}
