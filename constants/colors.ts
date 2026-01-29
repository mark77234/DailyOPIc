export type PrimaryShade = "100" | "200" | "300" | "400" | "500" | "600";

export const primary: Record<PrimaryShade, string> = {
  "100": "#EDE9FF",
  "200": "#DCD6FF",
  "300": "#BFB2FF",
  "400": "#9B87F5",
  "500": "#6F52EB",
  "600": "#4B24FF",
};

export const colors = {
  primary,
  black: "#000000",
  white: "#FFFFFF",
};

export const themeColors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: primary["600"],
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: primary["600"],
    primary,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: primary["400"],
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primary["400"],
    primary,
  },
};

// Backward compatibility for any existing imports.
export const PrimaryColors = primary;
