import { ImageResponse } from "next/og";

export const alt = "LinkDeck.in - One beautiful page for all your links";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 20% 15%, rgba(0,184,219,0.28), transparent 28%), #02070d",
          color: "white",
          padding: 80,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#00B8DB",
            }}
          />
          LinkDeck.in
        </div>
        <div
          style={{
            maxWidth: 880,
            marginTop: 56,
            fontSize: 78,
            lineHeight: 1,
            letterSpacing: -2,
            fontWeight: 800,
          }}
        >
          One beautiful page for all your links.
        </div>
        <div
          style={{
            maxWidth: 780,
            marginTop: 32,
            color: "rgba(255,255,255,0.72)",
            fontSize: 30,
            lineHeight: 1.35,
          }}
        >
          Organize links, customize your profile, track clicks, and share one clean public page.
        </div>
      </div>
    ),
    size
  );
}
