import { Inter, Poppins, Montserrat, Roboto, Outfit, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const FONT_CLASS_MAP = {
  INTER: inter.className,
  POPPINS: poppins.className,
  MONTSERRAT: montserrat.className,
  ROBOTO: roboto.className,
  OUTFIT: outfit.className,
  PLAYFAIR: playfair.className,
} as const;

export function getFontClass(fontFamily: string | null | undefined) {
  switch (fontFamily) {
    case "INTER":
      return FONT_CLASS_MAP.INTER;
    case "POPPINS":
      return FONT_CLASS_MAP.POPPINS;
    case "MONTSERRAT":
      return FONT_CLASS_MAP.MONTSERRAT;
    case "ROBOTO":
      return FONT_CLASS_MAP.ROBOTO;
    case "OUTFIT":
      return FONT_CLASS_MAP.OUTFIT;
    case "PLAYFAIR":
      return FONT_CLASS_MAP.PLAYFAIR;
    default:
      return FONT_CLASS_MAP.INTER;
  }
}