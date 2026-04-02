type NormalizeUrlResult =
  | { success: true; url: string }
  | { success: false; error: string };

export function normalizeUrl(raw: string): NormalizeUrlResult {
  const value = raw.trim();

  if (!value) {
    return { success: false, error: "URL is required" };
  }

  const withProtocol =
    value.startsWith("http://") || value.startsWith("https://")
      ? value
      : `https://${value}`;

  let parsed: URL;

  try {
    parsed = new URL(withProtocol);
  } catch {
    return { success: false, error: "Please enter a valid URL" };
  }

  if (!parsed.hostname.includes(".")) {
    return { success: false, error: "Please enter a valid URL" };
  }

  return { success: true, url: parsed.toString() };
}

export async function fetchPageTitle(url: string) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 LinkDeckBot/1.0",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const html = await res.text();

    const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (!match?.[1]) return null;

    const title = match[1].trim().replace(/\s+/g, " ");
    return title || null;
  } catch {
    return null;
  }
}

export function fallbackTitleFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "Untitled Link";
  }
}