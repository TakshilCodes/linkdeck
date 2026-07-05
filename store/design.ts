import { create } from "zustand";
import type { ResolvedTheme, CustomTheme } from "@/types/theme";

type DesignStore = {
  previewTheme: ResolvedTheme | null;
  setPreviewTheme: (theme: ResolvedTheme | null) => void;
  
  previewProfile: { displayName?: string; bio?: string } | null;
  setPreviewProfile: (profile: { displayName?: string; bio?: string } | null) => void;
  updatePreviewProfile: (updates: { displayName?: string; bio?: string }) => void;

  previewCustomTheme: Partial<CustomTheme> | null;
  setPreviewCustomTheme: (custom: Partial<CustomTheme> | null) => void;
  updatePreviewCustomTheme: (updates: Partial<CustomTheme>) => void;

  mobileDesignPanelOpen: boolean;
  setMobileDesignPanelOpen: (open: boolean) => void;
};

export const useDesignStore = create<DesignStore>((set) => ({
  previewTheme: null,
  setPreviewTheme: (theme) => set({ previewTheme: theme }),

  previewProfile: null,
  setPreviewProfile: (profile) => set({ previewProfile: profile }),
  updatePreviewProfile: (updates) =>
    set((state) => ({
      previewProfile: { ...state.previewProfile, ...updates },
    })),

  previewCustomTheme: null,
  setPreviewCustomTheme: (custom) => set({ previewCustomTheme: custom }),
  updatePreviewCustomTheme: (updates) =>
    set((state) => ({
      previewCustomTheme: { ...state.previewCustomTheme, ...updates },
    })),

  mobileDesignPanelOpen: false,
  setMobileDesignPanelOpen: (open) => set({ mobileDesignPanelOpen: open }),
}));
