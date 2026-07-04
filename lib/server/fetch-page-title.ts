import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const FETCH_TIMEOUT_MS = 5_000;
const MAX_TITLE_HTML_BYTES = 256 * 1024;
const MAX_REDIRECTS = 2;

function isBlockedHostname(hostname: string) {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized === "0.0.0.0"
  );
}

function isPrivateIPv4(ip: string) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return true;
  }

  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function isPrivateIPv6(ip: string) {
  const normalized = ip.toLowerCase();

  if (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80")
  ) {
    return true;
  }

  const mappedIpv4 = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  return mappedIpv4 ? isPrivateIPv4(mappedIpv4) : false;
}

function isBlockedIp(address: string) {
  const version = isIP(address);
  if (version === 4) return isPrivateIPv4(address);
  if (version === 6) return isPrivateIPv6(address);
  return true;
}

async function assertPublicHttpUrl(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Unsupported URL protocol");
  }

  if (isBlockedHostname(url.hostname)) {
    throw new Error("Blocked hostname");
  }

  if (isIP(url.hostname)) {
    if (isBlockedIp(url.hostname)) {
      throw new Error("Blocked IP address");
    }
    return;
  }

  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((entry) => isBlockedIp(entry.address))) {
    throw new Error("Blocked resolved address");
  }
}

async function readLimitedText(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) return "";

  const chunks: Uint8Array[] = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    size += value.byteLength;
    if (size > MAX_TITLE_HTML_BYTES) {
      throw new Error("Response too large");
    }

    chunks.push(value);
  }

  return new TextDecoder().decode(Buffer.concat(chunks));
}

async function fetchHtml(url: URL, redirectsRemaining: number): Promise<string | null> {
  await assertPublicHttpUrl(url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 LinkDeckBot/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
    });

    if (response.status >= 300 && response.status < 400 && redirectsRemaining > 0) {
      const location = response.headers.get("location");
      if (!location) return null;
      return fetchHtml(new URL(location, url), redirectsRemaining - 1);
    }

    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType && !contentType.toLowerCase().includes("text/html")) {
      return null;
    }

    return readLimitedText(response);
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchPageTitle(url: string) {
  try {
    const parsed = new URL(url);
    const html = await fetchHtml(parsed, MAX_REDIRECTS);
    if (!html) return null;

    const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (!match?.[1]) return null;

    const title = match[1].trim().replace(/\s+/g, " ");
    return title || null;
  } catch {
    return null;
  }
}