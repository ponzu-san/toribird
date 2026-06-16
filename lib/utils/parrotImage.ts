export const DEFAULT_PARROT_IMAGE_URL =
  "https://images.unsplash.com/vector-1778048385295-f73e72f68161?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export function getParrotImageUrl(imageUrl: string): string {
  return imageUrl || DEFAULT_PARROT_IMAGE_URL;
}
