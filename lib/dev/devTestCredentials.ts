export function getDevTestCredentials(): { email: string; password: string } | null {
  const email = process.env.DEV_TEST_EMAIL?.trim();
  const password = process.env.DEV_TEST_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email, password };
}
