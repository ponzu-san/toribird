import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { getStagingBasicAuthCredentials, stagingBasicAuthResponse } from "@/lib/middleware/stagingBasicAuth";

function basicAuthHeader(user: string, password: string): string {
  return `Basic ${btoa(`${user}:${password}`)}`;
}

function createRequest(authHeader?: string): NextRequest {
  const headers = new Headers();
  if (authHeader) {
    headers.set("authorization", authHeader);
  }

  return new NextRequest("http://localhost:3100/", { headers });
}

describe("getStagingBasicAuthCredentials", () => {
  const originalUser = process.env.STAGING_BASIC_AUTH_USER;
  const originalPassword = process.env.STAGING_BASIC_AUTH_PASSWORD;

  afterEach(() => {
    if (originalUser === undefined) {
      delete process.env.STAGING_BASIC_AUTH_USER;
    } else {
      process.env.STAGING_BASIC_AUTH_USER = originalUser;
    }

    if (originalPassword === undefined) {
      delete process.env.STAGING_BASIC_AUTH_PASSWORD;
    } else {
      process.env.STAGING_BASIC_AUTH_PASSWORD = originalPassword;
    }
  });

  it("returns null when env is not set", () => {
    delete process.env.STAGING_BASIC_AUTH_USER;
    delete process.env.STAGING_BASIC_AUTH_PASSWORD;
    expect(getStagingBasicAuthCredentials()).toBeNull();
  });

  it("returns credentials when both env vars are set", () => {
    process.env.STAGING_BASIC_AUTH_USER = "testuser";
    process.env.STAGING_BASIC_AUTH_PASSWORD = "testpass";
    expect(getStagingBasicAuthCredentials()).toEqual({ user: "testuser", password: "testpass" });
  });
});

describe("stagingBasicAuthResponse", () => {
  const originalUser = process.env.STAGING_BASIC_AUTH_USER;
  const originalPassword = process.env.STAGING_BASIC_AUTH_PASSWORD;

  beforeEach(() => {
    process.env.STAGING_BASIC_AUTH_USER = "testuser";
    process.env.STAGING_BASIC_AUTH_PASSWORD = "testpass";
  });

  afterEach(() => {
    if (originalUser === undefined) {
      delete process.env.STAGING_BASIC_AUTH_USER;
    } else {
      process.env.STAGING_BASIC_AUTH_USER = originalUser;
    }

    if (originalPassword === undefined) {
      delete process.env.STAGING_BASIC_AUTH_PASSWORD;
    } else {
      process.env.STAGING_BASIC_AUTH_PASSWORD = originalPassword;
    }
  });

  it("passes through when env is not configured", () => {
    delete process.env.STAGING_BASIC_AUTH_USER;
    delete process.env.STAGING_BASIC_AUTH_PASSWORD;
    expect(stagingBasicAuthResponse(createRequest())).toBeNull();
  });

  it("passes through with valid credentials", () => {
    expect(stagingBasicAuthResponse(createRequest(basicAuthHeader("testuser", "testpass")))).toBeNull();
  });

  it("allows passwords containing colons", () => {
    process.env.STAGING_BASIC_AUTH_PASSWORD = "pass:word:part";
    expect(stagingBasicAuthResponse(createRequest(basicAuthHeader("testuser", "pass:word:part")))).toBeNull();
  });

  it("returns 401 when authorization header is missing", () => {
    const response = stagingBasicAuthResponse(createRequest());
    expect(response?.status).toBe(401);
    expect(response?.headers.get("WWW-Authenticate")).toBe('Basic realm="Toribird"');
  });

  it("returns 401 for invalid credentials", () => {
    const response = stagingBasicAuthResponse(createRequest(basicAuthHeader("testuser", "wrong")));
    expect(response?.status).toBe(401);
  });
});
