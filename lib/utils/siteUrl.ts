import { headers } from "next/headers";

function getSiteUrlFromEnv(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3100";
}

function resolveProto(host: string, forwardedProto: string | null): string {
  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() ?? "https";
  }
  return host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
}

export async function getRequestOrigin(): Promise<string> {
  try {
    const headersList = await headers();
    const host =
      headersList.get("x-forwarded-host")?.split(",")[0]?.trim() ?? headersList.get("host")?.trim();

    if (host) {
      const proto = resolveProto(host, headersList.get("x-forwarded-proto"));
      return `${proto}://${host}`;
    }
  } catch {
    // headers() unavailable outside request context
  }

  return getSiteUrlFromEnv();
}

export function buildAuthCallbackUrl(origin: string, next = "/"): string {
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}
