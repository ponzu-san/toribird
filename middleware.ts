import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { GUEST_COOKIE_NAME } from "@/lib/guest/constants";
import { stagingBasicAuthResponse } from "@/lib/middleware/stagingBasicAuth";

const PUBLIC_PATHS = ["/welcome", "/login", "/signup", "/privacy"];
const PROTECTED_PATHS = ["/", "/chart", "/parrot", "/benchmark", "/settings"];

function hasSupabaseAuthCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(({ name }) => name.includes("-auth-token"));
}

function hasGuestCookie(request: NextRequest): boolean {
  return Boolean(request.cookies.get(GUEST_COOKIE_NAME)?.value);
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.includes(pathname);
}

export async function middleware(request: NextRequest) {
  const basicAuthBlock = stagingBasicAuthResponse(request);
  if (basicAuthBlock) {
    return basicAuthBlock;
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!isSupabaseConfigured()) {
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({ request });

    if (hasSupabaseAuthCookie(request)) {
      const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      });

      try {
        await supabase.auth.getUser();
      } catch {
        // ignore
      }
    }

    return supabaseResponse;
  }

  if (pathname === "/welcome") {
    if (hasSupabaseAuthCookie(request) || hasGuestCookie(request)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedPath(pathname)) {
    const allowed = hasSupabaseAuthCookie(request) || hasGuestCookie(request);
    if (!allowed) {
      return NextResponse.redirect(new URL("/welcome", request.url));
    }
  }

  if (isSupabaseConfigured() && hasSupabaseAuthCookie(request)) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    try {
      await supabase.auth.getUser();
    } catch {
      // ignore
    }

    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
