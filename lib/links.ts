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

export function fallbackTitleFromUrl(url: string) {
  return displayDomainFromUrl(url) || "Untitled Link";
}

export function displayDomainFromUrl(raw: string | null | undefined) {
  const value = raw?.trim();
  if (!value) return "";

  const withProtocol =
    value.startsWith("http://") || value.startsWith("https://")
      ? value
      : `https://${value}`;

  try {
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}
