"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallPlatform = "ios" | "android" | "desktop";
export type InstallGuideKey = "iosSafari" | "iosChrome" | "androidManual";

function detectPlatform(ua: string): InstallPlatform {
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

function detectIosBrowser(ua: string): "safari" | "chrome" | "other" {
  if (/CriOS/.test(ua)) return "chrome";
  if (/Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)) return "safari";
  return "other";
}

function resolveGuideKey(platform: InstallPlatform, canInstall: boolean, ua: string): InstallGuideKey | null {
  if (platform === "desktop") return null;
  if (canInstall) return null;
  if (platform === "ios") {
    const browser = detectIosBrowser(ua);
    return browser === "chrome" ? "iosChrome" : "iosSafari";
  }
  if (platform === "android") return "androidManual";
  return null;
}

function isStandalone(): boolean {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>("desktop");

  useEffect(() => {
    setPlatform(detectPlatform(navigator.userAgent));
    setIsInstalled(isStandalone());

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const canInstall = deferredPrompt !== null;

  const guideKey = useMemo(
    () => resolveGuideKey(platform, canInstall, typeof navigator !== "undefined" ? navigator.userAgent : ""),
    [platform, canInstall],
  );

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome === "accepted";
  }, [deferredPrompt]);

  return {
    canInstall,
    isInstalled,
    platform,
    guideKey,
    promptInstall,
  };
}
