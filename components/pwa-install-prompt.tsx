"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PintailMark } from "@/components/pintail-logo";

const DISMISS_KEY = "pintail-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    function onPrompt(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setShow(false);
    setDeferred(null);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  function dismiss() {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-[72px] z-50 mx-auto max-w-md px-4">
      <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-card p-3 shadow-lg shadow-black/40">
        <PintailMark className="h-5 w-auto shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Add Pintail to your home screen</p>
          <p className="text-xs text-muted-foreground">
            Open it like an app, all trip long.
          </p>
        </div>
        <Button size="sm" onClick={install}>
          Add
        </Button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
