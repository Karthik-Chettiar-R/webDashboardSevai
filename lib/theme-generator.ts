// Theme Generator using 5 specific themes from tweakcn
// All themes are dark mode only
// 
// Available Themes:
// 1. Bold Tech - Purple/violet tech aesthetic (Roboto)
// 2. Doom 64 - Retro gaming red/orange/blue (Oxanium)
// 3. Quantum Rose - Pink/magenta/purple gradient (Quicksand)
// 4. Nature - Green/teal nature-inspired (Montserrat)
// 5. T3 Chat - Pink/magenta chat theme (Abel)

export interface Theme {
  name: string;
  fontFamily: string;
  fontName: string;
  radius: string;
  letterSpacing: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
}

// 5 predefined themes from tweakcn (dark mode only)
const themes: Theme[] = [
  {
    name: 'Bold Tech',
    fontFamily: 'Roboto, sans-serif',
    fontName: 'Roboto',
    radius: '0.625rem',
    letterSpacing: '0em',
    colors: {
      background: 'oklch(0.2077 0.0398 265.7549)',
      foreground: 'oklch(0.9299 0.0334 272.7879)',
      card: 'oklch(0.2573 0.0861 281.2883)',
      cardForeground: 'oklch(0.9299 0.0334 272.7879)',
      popover: 'oklch(0.2573 0.0861 281.2883)',
      popoverForeground: 'oklch(0.9299 0.0334 272.7879)',
      primary: 'oklch(0.6056 0.2189 292.7172)',
      primaryForeground: 'oklch(1.0000 0 0)',
      secondary: 'oklch(0.2573 0.0861 281.2883)',
      secondaryForeground: 'oklch(0.9299 0.0334 272.7879)',
      muted: 'oklch(0.2329 0.0919 279.1398)',
      mutedForeground: 'oklch(0.8112 0.1013 293.5712)',
      accent: 'oklch(0.4568 0.2146 277.0229)',
      accentForeground: 'oklch(0.9299 0.0334 272.7879)',
      destructive: 'oklch(0.6368 0.2078 25.3313)',
      destructiveForeground: 'oklch(1.0000 0 0)',
      border: 'oklch(0.2827 0.1351 291.0894)',
      input: 'oklch(0.2827 0.1351 291.0894)',
      ring: 'oklch(0.6056 0.2189 292.7172)',
      chart1: 'oklch(0.7090 0.1592 293.5412)',
      chart2: 'oklch(0.6056 0.2189 292.7172)',
      chart3: 'oklch(0.5413 0.2466 293.0090)',
      chart4: 'oklch(0.4907 0.2412 292.5809)',
      chart5: 'oklch(0.4320 0.2106 292.7591)'
    }
  },
  {
    name: 'Doom 64',
    fontFamily: 'Oxanium, sans-serif',
    fontName: 'Oxanium',
    radius: '0px',
    letterSpacing: '0em',
    colors: {
      background: 'oklch(0.2178 0 0)',
      foreground: 'oklch(0.9067 0 0)',
      card: 'oklch(0.2850 0 0)',
      cardForeground: 'oklch(0.9067 0 0)',
      popover: 'oklch(0.2850 0 0)',
      popoverForeground: 'oklch(0.9067 0 0)',
      primary: 'oklch(0.6083 0.2090 27.0276)',
      primaryForeground: 'oklch(1.0000 0 0)',
      secondary: 'oklch(0.6423 0.1467 133.0145)',
      secondaryForeground: 'oklch(0 0 0)',
      muted: 'oklch(0.2645 0 0)',
      mutedForeground: 'oklch(0.7058 0 0)',
      accent: 'oklch(0.7482 0.1235 244.7492)',
      accentForeground: 'oklch(0 0 0)',
      destructive: 'oklch(0.7839 0.1719 68.0943)',
      destructiveForeground: 'oklch(0 0 0)',
      border: 'oklch(0.4091 0 0)',
      input: 'oklch(0.4091 0 0)',
      ring: 'oklch(0.6083 0.2090 27.0276)',
      chart1: 'oklch(0.6083 0.2090 27.0276)',
      chart2: 'oklch(0.6423 0.1467 133.0145)',
      chart3: 'oklch(0.7482 0.1235 244.7492)',
      chart4: 'oklch(0.7839 0.1719 68.0943)',
      chart5: 'oklch(0.6471 0.0334 40.7963)'
    }
  },
  {
    name: 'Quantum Rose',
    fontFamily: 'Quicksand, sans-serif',
    fontName: 'Quicksand',
    radius: '0.5rem',
    letterSpacing: '0em',
    colors: {
      background: 'oklch(0.1808 0.0535 313.7159)',
      foreground: 'oklch(0.8624 0.1307 326.6356)',
      card: 'oklch(0.2398 0.0661 313.2337)',
      cardForeground: 'oklch(0.8624 0.1307 326.6356)',
      popover: 'oklch(0.2398 0.0661 313.2337)',
      popoverForeground: 'oklch(0.8624 0.1307 326.6356)',
      primary: 'oklch(0.7543 0.2319 332.0212)',
      primaryForeground: 'oklch(0.1608 0.0493 327.5673)',
      secondary: 'oklch(0.3184 0.0915 319.6465)',
      secondaryForeground: 'oklch(0.8624 0.1307 326.6356)',
      muted: 'oklch(0.2701 0.0770 312.3525)',
      mutedForeground: 'oklch(0.7116 0.1623 327.1132)',
      accent: 'oklch(0.3558 0.1201 325.7655)',
      accentForeground: 'oklch(0.8624 0.1307 326.6356)',
      destructive: 'oklch(0.6539 0.2441 7.1740)',
      destructiveForeground: 'oklch(0.9821 0 0)',
      border: 'oklch(0.3280 0.1202 313.5393)',
      input: 'oklch(0.3184 0.0915 319.6465)',
      ring: 'oklch(0.7543 0.2319 332.0212)',
      chart1: 'oklch(0.7543 0.2319 332.0212)',
      chart2: 'oklch(0.6508 0.2159 317.6331)',
      chart3: 'oklch(0.6249 0.2233 292.7656)',
      chart4: 'oklch(0.6067 0.1649 278.7172)',
      chart5: 'oklch(0.6235 0.2019 268.0521)'
    }
  },
  {
    name: 'Nature',
    fontFamily: 'Montserrat, sans-serif',
    fontName: 'Montserrat',
    radius: '0.5rem',
    letterSpacing: '0em',
    colors: {
      background: 'oklch(0.2683 0.0279 150.7681)',
      foreground: 'oklch(0.9423 0.0097 72.6595)',
      card: 'oklch(0.3327 0.0271 146.9867)',
      cardForeground: 'oklch(0.9423 0.0097 72.6595)',
      popover: 'oklch(0.3327 0.0271 146.9867)',
      popoverForeground: 'oklch(0.9423 0.0097 72.6595)',
      primary: 'oklch(0.6731 0.1624 144.2083)',
      primaryForeground: 'oklch(0.2157 0.0453 145.7256)',
      secondary: 'oklch(0.3942 0.0265 142.9926)',
      secondaryForeground: 'oklch(0.8970 0.0166 142.5518)',
      muted: 'oklch(0.2926 0.0212 147.7496)',
      mutedForeground: 'oklch(0.8579 0.0174 76.0955)',
      accent: 'oklch(0.5752 0.1446 144.1813)',
      accentForeground: 'oklch(0.9423 0.0097 72.6595)',
      destructive: 'oklch(0.5386 0.1937 26.7249)',
      destructiveForeground: 'oklch(0.9423 0.0097 72.6595)',
      border: 'oklch(0.3942 0.0265 142.9926)',
      input: 'oklch(0.3942 0.0265 142.9926)',
      ring: 'oklch(0.6731 0.1624 144.2083)',
      chart1: 'oklch(0.7660 0.1179 145.2950)',
      chart2: 'oklch(0.7185 0.1417 144.8887)',
      chart3: 'oklch(0.6731 0.1624 144.2083)',
      chart4: 'oklch(0.6291 0.1543 144.2031)',
      chart5: 'oklch(0.5752 0.1446 144.1813)'
    }
  },
  {
    name: 'T3 Chat',
    fontFamily: 'Abel, sans-serif',
    fontName: 'Abel',
    radius: '0.5rem',
    letterSpacing: '0em',
    colors: {
      background: 'oklch(0.2409 0.0201 307.5346)',
      foreground: 'oklch(0.8398 0.0387 309.5391)',
      card: 'oklch(0.2803 0.0232 307.5413)',
      cardForeground: 'oklch(0.8456 0.0302 341.4597)',
      popover: 'oklch(0.1548 0.0132 338.9015)',
      popoverForeground: 'oklch(0.9647 0.0091 341.8035)',
      primary: 'oklch(0.4607 0.1853 4.0994)',
      primaryForeground: 'oklch(0.8560 0.0618 346.3684)',
      secondary: 'oklch(0.3137 0.0306 310.0610)',
      secondaryForeground: 'oklch(0.8483 0.0382 307.9613)',
      muted: 'oklch(0.2634 0.0219 309.4748)',
      mutedForeground: 'oklch(0.7940 0.0372 307.1032)',
      accent: 'oklch(0.3649 0.0508 308.4911)',
      accentForeground: 'oklch(0.9647 0.0091 341.8035)',
      destructive: 'oklch(0.2258 0.0524 12.6119)',
      destructiveForeground: 'oklch(1.0000 0 0)',
      border: 'oklch(0.3286 0.0154 343.4461)',
      input: 'oklch(0.3387 0.0195 332.8347)',
      ring: 'oklch(0.5916 0.2180 0.5844)',
      chart1: 'oklch(0.5316 0.1409 355.1999)',
      chart2: 'oklch(0.5633 0.1912 306.8561)',
      chart3: 'oklch(0.7227 0.1502 60.5799)',
      chart4: 'oklch(0.6193 0.2029 312.7422)',
      chart5: 'oklch(0.6118 0.2093 6.1387)'
    }
  }
];

// Get a random theme from the 5 available
export function generateRandomTheme(): Theme {
  const randomIndex = Math.floor(Math.random() * themes.length);
  return themes[randomIndex];
}

// Apply theme to the document
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  // Remove existing dynamic theme style if it exists
  const existingStyle = document.getElementById('dynamic-theme');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create a style element with high specificity for dark mode
  const styleEl = document.createElement('style');
  styleEl.id = 'dynamic-theme';
  styleEl.textContent = `
    .dark {
      --background: ${theme.colors.background} !important;
      --foreground: ${theme.colors.foreground} !important;
      --card: ${theme.colors.card} !important;
      --card-foreground: ${theme.colors.cardForeground} !important;
      --popover: ${theme.colors.popover} !important;
      --popover-foreground: ${theme.colors.popoverForeground} !important;
      --primary: ${theme.colors.primary} !important;
      --primary-foreground: ${theme.colors.primaryForeground} !important;
      --secondary: ${theme.colors.secondary} !important;
      --secondary-foreground: ${theme.colors.secondaryForeground} !important;
      --muted: ${theme.colors.muted} !important;
      --muted-foreground: ${theme.colors.mutedForeground} !important;
      --accent: ${theme.colors.accent} !important;
      --accent-foreground: ${theme.colors.accentForeground} !important;
      --destructive: ${theme.colors.destructive} !important;
      --destructive-foreground: ${theme.colors.destructiveForeground} !important;
      --border: ${theme.colors.border} !important;
      --input: ${theme.colors.input} !important;
      --ring: ${theme.colors.ring} !important;
      --chart-1: ${theme.colors.chart1} !important;
      --chart-2: ${theme.colors.chart2} !important;
      --chart-3: ${theme.colors.chart3} !important;
      --chart-4: ${theme.colors.chart4} !important;
      --chart-5: ${theme.colors.chart5} !important;
      --radius: ${theme.radius} !important;
      --font-family: ${theme.fontFamily};
      --letter-spacing: ${theme.letterSpacing};
    }
  `;
  document.head.appendChild(styleEl);

  // Also apply to root for non-dark fallback
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--card', theme.colors.card);
  root.style.setProperty('--card-foreground', theme.colors.cardForeground);
  root.style.setProperty('--popover', theme.colors.popover);
  root.style.setProperty('--popover-foreground', theme.colors.popoverForeground);
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--secondary-foreground', theme.colors.secondaryForeground);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--muted-foreground', theme.colors.mutedForeground);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
  root.style.setProperty('--destructive', theme.colors.destructive);
  root.style.setProperty('--destructive-foreground', theme.colors.destructiveForeground);
  root.style.setProperty('--border', theme.colors.border);
  root.style.setProperty('--input', theme.colors.input);
  root.style.setProperty('--ring', theme.colors.ring);

  // Apply chart colors
  root.style.setProperty('--chart-1', theme.colors.chart1);
  root.style.setProperty('--chart-2', theme.colors.chart2);
  root.style.setProperty('--chart-3', theme.colors.chart3);
  root.style.setProperty('--chart-4', theme.colors.chart4);
  root.style.setProperty('--chart-5', theme.colors.chart5);

  // Apply typography
  root.style.setProperty('--font-family', theme.fontFamily);
  document.body.style.fontFamily = theme.fontFamily;

  // Apply spacing
  root.style.setProperty('--radius', theme.radius);
  root.style.setProperty('--letter-spacing', theme.letterSpacing);
  document.body.style.letterSpacing = theme.letterSpacing;

  // Log theme change for debugging
  console.log(`🎨 Theme applied: ${theme.name} with ${theme.fontName}`);
}

// Refresh theme - generates and applies a new random theme
export function refreshTheme(): Theme {
  const newTheme = generateRandomTheme();
  applyTheme(newTheme);
  return newTheme;
}
