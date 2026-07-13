function appEnv(): string {
  return (process.env.NEXT_PUBLIC_APP_ENV ?? "dev").toLowerCase().trim();
}

function getAppBaseUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ?? process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch {
      // Fall back to the known deployment URL when configuration is malformed.
    }
  }

  return appEnv() === "prod" ? "https://linkdeck.in" : "http://localhost:3000";
}

/** Shown in the URL bar (no protocol), e.g. `linkdeck.in/jane` or `localhost:3000/jane`. */
export function getProfileUrlDisplay(username: string): string {
  const safe = username?.trim();
  if (!safe) return "Preview";

  return `${getAppBaseUrl().replace(/^https?:\/\//, "")}/${safe}`;
}

/** Full URL copied to the clipboard and used by the share dialog. */
export function getProfileUrlClipboard(username: string): string {
  const safe = username?.trim();
  if (!safe) return "";

  return `${getAppBaseUrl()}/${safe}`;
}