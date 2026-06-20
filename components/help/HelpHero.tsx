import HelpSearch from "./HelpSearch";

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
};

export default function HelpHero({ searchTerm, onSearchChange, onClearSearch }: Props) {
  return (
    <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-[#07111d]/80 px-6 py-16 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-10 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.14),transparent_25%)]" />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-cyan-400/15 bg-cyan-400/8 px-4 py-2 text-sm font-medium text-cyan-200/90">
          LinkDeck Help Center
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          How can we help?
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
          Find answers, guides, and resources to get the most out of LinkDeck.
        </p>
        <div className="mt-10 w-full">
          <HelpSearch value={searchTerm} onChange={onSearchChange} onClear={onClearSearch} />
        </div>
      </div>
    </section>
  );
}
