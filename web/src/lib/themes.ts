// web/src/lib/themes.ts

/** Lightweight theme system for UIW.
 *  - Each theme defines CSS variable values + a preferred font stack.
 *  - Use with the helper `resolveThemeVars` to write vars into :root.
 */

export type ThemeVars = {
  bg: string;       // page background (large gradients welcome)
  card: string;     // card surface
  ink: string;      // primary text color
  accent: string;   // primary accent
  accent2: string;  // secondary accent
};

export type ThemePack = {
  /** Human-readable name shown in Admin */
  name: string;
  /** CSS variables used by the app’s styles */
  vars: ThemeVars;
  /** Font family stack string (will be applied to <body>) */
  font: string;
  /** Optional background gradient or image (CSS) */
  backgroundCss?: string;
};

export type ThemeKey =
  | "soft-blush"
  | "cozy-winter"
  | "sultry-velvet"
  | "dark-romance";

/** World-class, cozy defaults. */
export const THEME_PACKS: Record<ThemeKey, ThemePack> = {
  "soft-blush": {
    name: "Soft Blush",
    vars: {
      bg: "#fff7fb",
      card: "#ffe9f3",
      ink: "#4b2b3f",
      accent: "#e48db0",
      accent2: "#c6a7f0",
    },
    font:
      'Quicksand, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    backgroundCss:
      "radial-gradient(1200px 800px at 50% -10%, #ffe1f0 0%, #fff7fb 40%, #ffffff 100%)",
  },

  "cozy-winter": {
    name: "Cozy Winter",
    vars: {
      bg: "#f6f7fb",
      card: "#edf0f7",
      ink: "#1f2a44",
      accent: "#6ba3ff",
      accent2: "#b1c7ff",
    },
    font: 'Lora, Georgia, "Times New Roman", serif',
    backgroundCss:
      "radial-gradient(1100px 700px at 60% -20%, #e9f0ff 0%, #f6f7fb 45%, #ffffff 100%)",
  },

  "sultry-velvet": {
    name: "Sultry Velvet",
    vars: {
      bg: "#1a0f14",
      card: "#2a1822",
      ink: "#ffeaf2",
      accent: "#b8336a",
      accent2: "#6f2b62",
    },
    font: '"Playfair Display", Georgia, serif',
    backgroundCss:
      "radial-gradient(1000px 700px at 50% -10%, #321625 0%, #1a0f14 70%)",
  },

  "dark-romance": {
    name: "Dark Mode Romance",
    vars: {
      bg: "#0f0f14",
      card: "#181820",
      ink: "#f7eaff",
      accent: "#b57cf0",
      accent2: "#6c4ccf",
    },
    font: '"Cormorant Garamond", Georgia, serif',
    backgroundCss:
      "radial-gradient(1000px 700px at 50% -10%, #2a2038 0%, #0f0f14 70%)",
  },
};

/** Fallback-safe resolver (never returns undefined values). */
export function resolveThemeVars(themeKey?: string): {
  packKey: ThemeKey;
  pack: ThemePack;
  cssVars: Record<string, string>;
} {
  const key = (themeKey as ThemeKey) in THEME_PACKS ? (themeKey as ThemeKey) : "soft-blush";
  const pack = THEME_PACKS[key];

  const cssVars: Record<string, string> = {
    "--bg": pack.vars.bg,
    "--card": pack.vars.card,
    "--ink": pack.vars.ink,
    "--accent": pack.vars.accent,
    "--accent-2": pack.vars.accent2,
  };

  return { packKey: key, pack, cssVars };
}

/** Convenience: applies the theme directly to documentElement/body. */
export function applyThemeToDocument(themeKey?: string) {
  if (typeof document === "undefined") return;
  const { pack, cssVars } = resolveThemeVars(themeKey);

  const root = document.documentElement;
  Object.entries(cssVars).forEach(([k, v]) => root.style.setProperty(k, v));

  if (pack.backgroundCss) {
    (document.body.style as any).background = pack.backgroundCss;
  }
  (document.body.style as any).fontFamily = pack.font;
}

/** Small helper list for Admin dropdowns. */
export function themeOptions(): Array<{ key: ThemeKey; name: string }> {
  return (Object.keys(THEME_PACKS) as ThemeKey[]).map((key) => ({
    key,
    name: THEME_PACKS[key].name,
  }));
}
