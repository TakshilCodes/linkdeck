type SplitTextProps = {
  text: string;
  className?: string;
};

export default function SplitText({ text, className = "" }: SplitTextProps) {
  const words = text.split(" ");

  return (
    <span className={["inline-block", className].join(" ")} aria-label={text}>
      <style>
        {
          "@keyframes landing-split-rise { from { opacity: 0; transform: translateY(18px); filter: blur(8px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } } @media (prefers-reduced-motion: reduce) { .landing-split-word { opacity: 1 !important; transform: none !important; filter: none !important; animation: none !important; } }"
        }
      </style>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="landing-split-word inline-block opacity-0"
            style={{
              animation:
                "landing-split-rise 720ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
              animationDelay: `${120 + index * 58}ms`,
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00a0" : ""}
          </span>
        ))}
      </span>
    </span>
  );
}
