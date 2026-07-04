export function isDevToolsEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_DEV_TOOLS === "true";
}
