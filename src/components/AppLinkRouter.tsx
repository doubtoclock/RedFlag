"use client";

import { App } from "@capacitor/app";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const APP_LINK_ORIGIN = "https://red-flag-rose.vercel.app";
const TEST_PATHS = new Set(["/test", "/test/"]);
const DUPLICATE_EVENT_WINDOW_MILLIS = 2_000;

function getAppLinkDestination(rawUrl: string | undefined): string | null {
  if (!rawUrl) {
    return null;
  }

  try {
    const url = new URL(rawUrl);
    if (
      url.origin !== APP_LINK_ORIGIN ||
      !TEST_PATHS.has(url.pathname) ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    return "/test";
  } catch {
    return null;
  }
}

/** Routes only the verified public App Link handled by the Android manifest. */
export function AppLinkRouter() {
  const router = useRouter();
  const lastNavigation = useRef<{ destination: string; at: number } | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let disposed = false;
    let listener: PluginListenerHandle | undefined;

    const handleUrl = (rawUrl: string | undefined) => {
      const destination = getAppLinkDestination(rawUrl);
      if (!destination || disposed) {
        return;
      }

      const now = Date.now();
      if (
        lastNavigation.current?.destination === destination &&
        now - lastNavigation.current.at < DUPLICATE_EVENT_WINDOW_MILLIS
      ) {
        return;
      }

      lastNavigation.current = { destination, at: now };
      router.replace(destination);
    };

    void (async () => {
      try {
        listener = await App.addListener("appUrlOpen", ({ url }) => handleUrl(url));
        if (disposed) {
          await listener.remove();
          return;
        }

        const launchUrl = await App.getLaunchUrl();
        handleUrl(launchUrl?.url);
      } catch {
        // Native App Link handling is unavailable only when the bridge is not ready.
      }
    })();

    return () => {
      disposed = true;
      if (listener) {
        void listener.remove();
      }
    };
  }, [router]);

  return null;
}
