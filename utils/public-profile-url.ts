function appEnv(): string {
  return (process.env.NEXT_PUBLIC_APP_ENV ?? "dev").toLowerCase().trim();
}

/** Shown in the URL bar (no protocol), e.g. `linkdeck.in/jane` or `localhost:3000/jane`. */
export function getProfileUrlDisplay(username: string): string {
  const safe = username?.trim();
  if (!safe) return "Preview";

  if (appEnv() === "prod") {
    return `linkdeck.in/${safe}`;
  }

  return `localhost:3000/${safe}`;
}

/** Full URL copied to the clipboard. */
export function getProfileUrlClipboard(username: string): string {
  const safe = username?.trim();
  if (!safe) return "";

  if (appEnv() === "prod") {
    return `https://linkdeck.in/${safe}`;
  }

  return `http://localhost:3000/${safe}`;
}
