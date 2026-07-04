import { NextResponse, type NextRequest } from "next/server";

const BASIC_REALM = "Toribird";

export function getStagingBasicAuthCredentials(): { user: string; password: string } | null {
  const user = process.env.STAGING_BASIC_AUTH_USER;
  const password = process.env.STAGING_BASIC_AUTH_PASSWORD;

  if (!user || !password) {
    return null;
  }

  return { user, password };
}

function parseBasicAuthHeader(header: string): { user: string; password: string } | null {
  if (!header.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(header.slice(6));
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) {
      return null;
    }

    return {
      user: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

function unauthorizedResponse(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${BASIC_REALM}"`,
    },
  });
}

export function stagingBasicAuthResponse(request: NextRequest): NextResponse | null {
  const credentials = getStagingBasicAuthCredentials();
  if (!credentials) {
    return null;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return unauthorizedResponse();
  }

  const parsed = parseBasicAuthHeader(authHeader);
  if (!parsed || parsed.user !== credentials.user || parsed.password !== credentials.password) {
    return unauthorizedResponse();
  }

  return null;
}
