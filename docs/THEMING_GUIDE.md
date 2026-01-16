# Theming Guide

Dokumentasi lengkap mengenai sistem theming aplikasi Zookeeper Core, mencakup konfigurasi global styles, theme provider, dan mode toggle.

## Daftar Isi

1. [Overview](#overview)
2. [Arsitektur Theming](#arsitektur-theming)
3. [Global CSS Configuration](#global-css-configuration)
4. [Theme Provider Setup](#theme-provider-setup)
5. [Mode Toggle Implementation](#mode-toggle-implementation)
6. [Color System](#color-system)
7. [Customization Guide](#customization-guide)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Sistem theming aplikasi Zookeeper Core dibangun dengan teknologi modern yang memungkinkan:

- **Mode Gelap (Dark) dan Terang (Light)**: Dukungan penuh untuk dua mode tema
- **CSS Variables**: Menggunakan CSS custom properties untuk fleksibilitas maksimal
- **OKLch Color Space**: Menggunakan format warna OKLch untuk konsistensi dan aksesibilitas
- **Next.js Themes**: Integrasi dengan library `next-themes` untuk manajemen tema yang robust
- **Tailwind CSS**: Integrasi seamless dengan utility-first CSS framework

### Technology Stack

| Teknologi         | Fungsi                                       | Lokasi                                        |
| ----------------- | -------------------------------------------- | --------------------------------------------- |
| **globals.css**   | Definisi CSS variables dan konfigurasi warna | `src/app/globals.css`                         |
| **ThemeProvider** | React Context provider untuk tema            | `src/components/providers/theme-provider.tsx` |
| **ModeToggle**    | Tombol untuk toggle antara mode terang/gelap | `src/components/ui/mode-toogle.tsx`           |
| **next-themes**   | Library untuk manajemen tema dan persistensi | npm package                                   |
| **Tailwind CSS**  | Utility CSS classes dan theme configuration  | `tailwind.config.ts`                          |

---

## Arsitektur Theming

### Component Hierarchy

```
RootLayout (src/app/layout.tsx)
├── ThemeProvider
│   ├── Tailwind root theme
│   └── next-themes configuration
│       └── Application Content
│           └── ModeToggle (untuk user interaction)
```

### Flow Diagram

```
User clicks ModeToggle
         ↓
setTheme('dark' or 'light')
         ↓
next-themes updates context & localStorage
         ↓
Document element class updated (.dark or .light)
         ↓
CSS variables applied via .dark selector
         ↓
UI components re-render dengan warna baru
```

---

## Global CSS Configuration

### Lokasi File

**File**: `src/app/globals.css`

### Imports

```css
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
```

- **tailwindcss**: Core Tailwind CSS framework
- **tw-animate-css**: Library tambahan untuk animasi Tailwind
- **@custom-variant dark**: Custom variant untuk dark mode selector

### CSS Variables Structure

#### Light Mode (`:root`)

**Warna Dasar**:

```css
--background: oklch(1 0 0); /* Putih, untuk background */
--foreground: oklch(0.2101 0.0318 264.6645); /* Biru gelap, untuk teks */
--card: oklch(1 0 0); /* Putih, untuk card containers */
--card-foreground: oklch(0.2101 0.0318 264.6645);
```

**Warna Semantic**:

```css
--primary: oklch(0.6716 0.1368 48.513); /* Oranye, warna primary */
--primary-foreground: oklch(1 0 0); /* Putih, teks di atas primary */
--secondary: oklch(0.536 0.0398 196.028); /* Biru, warna secondary */
--secondary-foreground: oklch(1 0 0);
--destructive: oklch(0.6368 0.2078 25.3313); /* Merah, untuk delete/danger */
--destructive-foreground: oklch(0.9851 0 0);
--accent: oklch(0.9491 0 0); /* Aksen cahaya */
--accent-foreground: oklch(0.2101 0.0318 264.6645);
```

**Warna Input & Border**:

```css
--border: oklch(0.9276 0.0058 264.5313); /* Abu-abu terang */
--input: oklch(0.9276 0.0058 264.5313); /* Sama dengan border */
--ring: oklch(0.6716 0.1368 48.513); /* Primary, untuk focus ring */
```

**Warna Muted (Secondary/Disabled)**:

```css
--muted: oklch(0.967 0.0029 264.5419); /* Abu-abu sangat terang */
--muted-foreground: oklch(0.551 0.0234 264.3637); /* Abu-abu medium */
```

**Sidebar Colors**:

```css
--sidebar: oklch(0.967 0.0029 264.5419);
--sidebar-foreground: oklch(0.2101 0.0318 264.6645);
--sidebar-primary: oklch(0.6716 0.1368 48.513);
--sidebar-primary-foreground: oklch(1 0 0);
--sidebar-accent: oklch(1 0 0);
--sidebar-accent-foreground: oklch(0.2101 0.0318 264.6645);
--sidebar-border: oklch(0.9276 0.0058 264.5313);
--sidebar-ring: oklch(0.6716 0.1368 48.513);
```

**Chart Colors** (untuk visualisasi data):

```css
--chart-1: oklch(0.594 0.0443 196.0233);
--chart-2: oklch(0.7214 0.1337 49.9802);
--chart-3: oklch(0.8721 0.0864 68.5474);
--chart-4: oklch(0.6268 0 0);
--chart-5: oklch(0.683 0 0);
```

#### Dark Mode (`.dark`)

Dark mode menggunakan selector `.dark` untuk override CSS variables. Berikut contoh override utama:

```css
.dark {
  --background: oklch(0.1797 0.0043 308.1928); /* Sangat gelap */
  --foreground: oklch(0.8109 0 0); /* Putih */
  --card: oklch(0.1822 0 0); /* Abu-abu sangat gelap */
  --primary: oklch(0.7214 0.1337 49.9802); /* Oranye lebih cerah */
  --secondary: oklch(0.594 0.0443 196.0233); /* Biru lebih cerah */
  --muted: oklch(0.252 0 0); /* Abu-abu gelap */
  --muted-foreground: oklch(0.6268 0 0); /* Abu-abu terang */
  --border: oklch(0.252 0 0); /* Abu-abu gelap */
  --input: oklch(0.252 0 0);
  /* ... dst */
}
```

### Tipografi & Border Radius

```css
--font-sans: Geist Mono, ui-monospace, monospace;
--font-serif: serif;
--font-mono: JetBrains Mono, monospace;
--radius: 0.75rem; /* 12px */
```

### Shadow System

```css
--shadow-2xs: 0px 1px 4px 0px hsl(0 0% 0% / 0.03);
--shadow-xs: 0px 1px 4px 0px hsl(0 0% 0% / 0.03);
--shadow-sm:
  0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05);
--shadow:
  0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05);
--shadow-md:
  0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 2px 4px -1px hsl(0 0% 0% / 0.05);
--shadow-lg:
  0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 4px 6px -1px hsl(0 0% 0% / 0.05);
--shadow-xl:
  0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 8px 10px -1px hsl(0 0% 0% / 0.05);
--shadow-2xl: 0px 1px 4px 0px hsl(0 0% 0% / 0.13);
```

### Tailwind Theme Integration

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-{1-5}: var(--chart-{1-5});
  --color-sidebar-*: var(--sidebar-*);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);   /* 8px */
  --radius-md: calc(var(--radius) - 2px);   /* 10px */
  --radius-lg: var(--radius);                /* 12px */
  --radius-xl: calc(var(--radius) + 4px);   /* 16px */

  --shadow-*: var(--shadow-*);
  --tracking-*: var(--tracking-*);
}
```

### OKLch Color Space Explanation

OKLch adalah format warna modern yang:

- **O** = Oklab (perceptually uniform color space)
- **K** = Chroma (saturasi warna)
- **L** = Lightness (kecerahan, 0-1)
- **h** = Hue (warna, 0-360)

**Keuntungan OKLch**:

1. **Perceptually Uniform**: Perbedaan warna terlihat konsisten di seluruh spectrum
2. **Lebih Baik untuk Dark Mode**: Transisi smooth antara light dan dark
3. **Aksesibilitas**: Easier to maintain WCAG contrast ratios
4. **Presisi**: Lebih accurate untuk color matching

**Format**: `oklch(lightness saturation hue)`

Contoh:

- `oklch(1 0 0)` = Putih (L=1, tidak ada saturasi)
- `oklch(0.2101 0.0318 264.6645)` = Biru gelap (L=21%, saturasi rendah, hue=264°)

---

## Theme Provider Setup

### Lokasi File

**File**: `src/components/providers/theme-provider.tsx`

### Code Explanation

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### Penjelasan Komponen

| Aspek                  | Penjelasan                                                                       |
| ---------------------- | -------------------------------------------------------------------------------- |
| **"use client"**       | Directive yang menandakan ini adalah Client Component (diperlukan untuk context) |
| **NextThemesProvider** | Library provider dari `next-themes` yang mengelola state tema                    |
| **Props Spreading**    | Menggunakan `...props` untuk forward semua props dari `next-themes`              |
| **Children Wrapping**  | Membungkus aplikasi agar semua child components bisa akses theme context         |

### Penggunaan di Root Layout

Biasanya di `src/app/layout.tsx`:

```tsx
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Configuration Props (dari next-themes)

| Prop                          | Default             | Deskripsi                                                                    |
| ----------------------------- | ------------------- | ---------------------------------------------------------------------------- |
| **attribute**                 | `"class"`           | Atribut yang digunakan untuk menyimpan tema (`"class"`, `"data-theme"`, dll) |
| **defaultTheme**              | `"system"`          | Tema default saat pertama kali load                                          |
| **enableSystem**              | `true`              | Gunakan system preference (OS dark/light mode)                               |
| **storageKey**                | `"theme"`           | Key untuk localStorage                                                       |
| **themes**                    | `["light", "dark"]` | Array nama tema yang tersedia                                                |
| **forcedTheme**               | `undefined`         | Force tema tertentu (disable toggle)                                         |
| **enableColorScheme**         | `true`              | Perbarui `color-scheme` meta tag                                             |
| **disableTransitionOnChange** | `false`             | Disable CSS transition saat ganti tema                                       |

---

## Mode Toggle Implementation

### Lokasi File

**File**: `src/components/ui/mode-toogle.tsx`

### Code Explanation

```tsx
"use client";

import * as React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Menunggu sampai mount di client untuk menghindari hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Tampilkan placeholder loading atau button disable
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="text-muted-foreground"
      >
        <IconSun size={20} />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-muted-foreground hover:text-primary transition-colors"
    >
      {theme === "dark" ? (
        <IconSun size={20} className="text-yellow-400" />
      ) : (
        <IconMoon size={20} className="text-slate-700 dark:text-slate-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

### Penjelasan Komponen

#### 1. **Hooks Usage**

```tsx
const { theme, setTheme } = useTheme();
const [mounted, setMounted] = React.useState(false);
```

- **`useTheme()`** dari `next-themes` memberikan akses ke:
  - `theme`: Tema saat ini (`"light"`, `"dark"`, atau `undefined`)
  - `setTheme(theme)`: Function untuk mengubah tema
- **`mounted` state**: Track apakah component sudah di-mount di client

#### 2. **Hydration Prevention**

```tsx
React.useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <Button disabled>...</Button>;
}
```

**Mengapa penting?**

- Next.js Server-Side Rendering (SSR) render component di server
- Client-side render component di browser
- Jika content berbeda antara server & client = **Hydration Mismatch Error**
- Solusi: Hanya render interactive content setelah component mount di client

#### 3. **Theme Toggle Logic**

```tsx
onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
```

Logika sederhana: Toggle antara dark dan light mode

#### 4. **Icon Display**

```tsx
{
  theme === "dark" ? (
    <IconSun size={20} className="text-yellow-400" />
  ) : (
    <IconMoon size={20} className="text-slate-700 dark:text-slate-200" />
  );
}
```

- **Dark mode**: Tampilkan sun icon (kuning) untuk indicate bisa switch ke light
- **Light mode**: Tampilkan moon icon (abu-abu) untuk indicate bisa switch ke dark

#### 5. **Accessibility**

```tsx
<span className="sr-only">Toggle theme</span>
```

- **sr-only**: Screen reader only class
- Untuk screen readers, menyediakan label yang jelas

#### 6. **Styling**

```tsx
className = "text-muted-foreground hover:text-primary transition-colors";
```

- **text-muted-foreground**: Warna default lebih subtle
- **hover:text-primary**: Highlight saat hover
- **transition-colors**: Smooth color transition

### Hook Hook `useTheme()`

**Return Value**:

```ts
{
  theme: string;              // Tema saat ini
  setTheme: (theme: string) => void;
  themes: string[];           // Array tema tersedia
  systemTheme: "light" | "dark" | undefined;
  resolvedTheme: string | undefined;
}
```

---

## Color System

### Color Palette

#### Light Mode

| Variable        | Color             | Penggunaan                            |
| --------------- | ----------------- | ------------------------------------- |
| `--primary`     | 🟠 Oranye         | Button, active state, primary actions |
| `--secondary`   | 🔵 Biru           | Secondary button, alternative CTA     |
| `--accent`      | ⚪ Putih          | Highlight, emphasis                   |
| `--destructive` | 🔴 Merah          | Delete, danger actions                |
| `--muted`       | ⬜ Abu-abu terang | Disabled state, placeholder           |
| `--border`      | ⬜ Abu-abu terang | Divider, form borders                 |

#### Dark Mode

Palette sama, tapi dengan lightness (L) yang di-adjust:

- Primary oranye: lebih cerah (0.7214)
- Secondary biru: lebih cerah (0.594)
- Background: sangat gelap (0.1797)
- Muted: abu-abu medium (0.252)

### Contrast & Accessibility

Setiap warna memiliki `--{color}-foreground` untuk contrast terjamin:

```css
/* Light Mode */
--primary: oklch(0.6716 0.1368 48.513); /* Oranye */
--primary-foreground: oklch(1 0 0); /* Putih di atas oranye */

/* Dark Mode */
--primary: oklch(0.7214 0.1337 49.9802); /* Oranye lebih cerah */
--primary-foreground: oklch(0.1797 0.0043 308.1928); /* Sangat gelap di atas */
```

### Sidebar Colors

Sidebar memiliki warna terpisah untuk customization:

- `--sidebar`: Background sidebar
- `--sidebar-foreground`: Text di sidebar
- `--sidebar-primary`: Active menu item
- `--sidebar-accent`: Hover state
- `--sidebar-border`: Divider

### Chart Colors

Lima warna untuk chart/visualisasi data:

```css
--chart-1: oklch(0.594 0.0443 196.0233); /* Biru */
--chart-2: oklch(0.7214 0.1337 49.9802); /* Oranye */
--chart-3: oklch(0.8721 0.0864 68.5474); /* Hijau */
--chart-4: oklch(0.6268 0 0); /* Abu-abu */
--chart-5: oklch(0.683 0 0); /* Abu-abu medium */
```

---

## Customization Guide

### Mengubah Primary Color

1. **Edit `src/app/globals.css`**:

```css
:root {
  /* Ganti primary color dari oranye ke purple */
  --primary: oklch(0.6 0.15 280); /* Purple */
  --primary-foreground: oklch(1 0 0); /* Keep white */
}

.dark {
  --primary: oklch(0.75 0.15 280); /* Purple lebih cerah */
  --primary-foreground: oklch(0.1797 0.0043 308.1928);
}
```

2. **Test di aplikasi**: Refresh browser dan lihat perubahan

### Menambah Warna Baru

Jika ingin menambah warna semantic baru:

1. **Definisikan di `:root`**:

```css
:root {
  --success: oklch(0.65 0.1 150); /* Hijau untuk success */
  --success-foreground: oklch(1 0 0);
  --warning: oklch(0.75 0.12 60); /* Kuning untuk warning */
  --warning-foreground: oklch(0.2101 0.0318 264.6645);
}

.dark {
  --success: oklch(0.8 0.1 150);
  --success-foreground: oklch(0.1797 0.0043 308.1928);
  --warning: oklch(0.85 0.12 60);
  --warning-foreground: oklch(0.1797 0.0043 308.1928);
}
```

2. **Tambahkan ke `@theme inline`**:

```css
@theme inline {
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

3. **Gunakan di Tailwind**:

```tsx
<Button className="bg-success text-success-foreground hover:bg-success/90">
  Success Action
</Button>
```

### Mengubah Font

Ubah di `:root`:

```css
:root {
  --font-sans: "Inter", "Segoe UI", sans-serif; /* Ganti dari Geist Mono */
  --font-mono: "Fira Code", monospace; /* Ganti dari JetBrains */
  --font-serif: "Georgia", serif;
}
```

### Mengubah Border Radius

```css
:root {
  --radius: 0.5rem; /* Lebih rounded (12px → 8px) */
}
```

Atau custom radius untuk cases tertentu:

```tsx
<div className="rounded-lg">12px radius</div>
<div className="rounded-[20px]">Custom 20px</div>
```

### Mengubah Shadow

Edit shadow definitions:

```css
:root {
  --shadow-sm: 0px 1px 2px 0px hsl(0 0% 0% / 0.05); /* Lebih subtle */
  --shadow-lg: 0px 8px 16px 0px hsl(0 0% 0% / 0.1); /* Lebih prominent */
}
```

### Forcing Tema (Disable Toggle)

Di layout, gunakan `forcedTheme`:

```tsx
<ThemeProvider forcedTheme="dark">{children}</ThemeProvider>
```

Ini akan disable toggle dan selalu gunakan dark mode.

---

## Troubleshooting

### Issue: Hydration Mismatch

**Gejala**: Console error `Hydration failed because the initial UI does not match`

**Penyebab**: Component render berbeda di server vs client

**Solusi**:

- Gunakan `mounted` state seperti di `ModeToggle`
- Gunakan `suppressHydrationWarning` di `<html>` tag

```tsx
<html lang="en" suppressHydrationWarning>
```

### Issue: Theme Tidak Persisten Setelah Refresh

**Penyebab**: localStorage tidak jalan atau disabled

**Solusi**:

- Cek browser settings (incognito mode bisa disable localStorage)
- Verifikasi `storageKey` config di `ThemeProvider`
- Check browser console untuk error

### Issue: Warna Tidak Berubah Saat Toggle

**Penyebab**: CSS tidak match dengan dark class, atau specificity issue

**Solusi**:

1. Verifikasi `.dark` class ada di HTML element:

   ```tsx
   // Di DevTools, periksa <html> atau <body> class
   <html class="dark">...</html>
   ```

2. Check CSS selector precedence:

   ```css
   /* ✅ Benar: specificity tinggi */
   .dark --my-color {
     /* override */
   }

   /* ❌ Salah: universal selector kurang specific */
   * {
     --my-color: white;
   }
   ```

3. Clear cache dan hard refresh:
   - Windows/Linux: `Ctrl + Shift + R`
   - macOS: `Cmd + Shift + R`

### Issue: Icon Tidak Muncul di ModeToggle

**Penyebab**: Icon library tidak installed atau unmounted

**Solusi**:

- Pastikan `@tabler/icons-react` installed
- ModeToggle hanya render setelah mount (check `mounted` state)

### Issue: Performance Issues dengan Theme Switching

**Gejala**: Lag atau flashing saat toggle

**Solusi**:

1. Enable `disableTransitionOnChange` untuk instant switch:

   ```tsx
   <ThemeProvider disableTransitionOnChange>
   ```

2. Atau gunakan CSS transition yang lebih efficient:

   ```css
   body {
     transition: background-color 100ms linear;
   }
   ```

3. Hindari inline styles yang dependent ke theme, gunakan CSS variables instead

### Issue: Dark Mode Tidak Match OS Preference

**Penyebab**: `enableSystem` atau `systemTheme` config issue

**Solusi**:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
```

---

## Best Practices

### 1. **Selalu Gunakan CSS Variables**

```tsx
/* ❌ Hindari hardcoded colors */
<div style={{ color: '#fff' }}>Text</div>

/* ✅ Gunakan CSS variables atau Tailwind classes */
<div className="text-foreground">Text</div>
<div style={{ color: 'var(--foreground)' }}>Text</div>
```

### 2. **Maintain Contrast Ratio**

Pastikan text bisa dibaca di light dan dark mode:

```css
.dark --my-foreground {
  /* Dark background needs lighter text */
  color: oklch(0.8 0.05 264.6645); /* Lebih terang */
}
```

### 3. **Test Di Dark Mode**

Selalu test UI di kedua mode:

```bash
# Toggle dark mode di DevTools > Rendering > Emulate CSS media feature prefers-color-scheme
```

### 4. **Avoid Flash of Wrong Theme**

```tsx
// di layout, gunakan suppressHydrationWarning
<html suppressHydrationWarning>
```

### 5. **Semantic Color Names**

Gunakan nama semantic bukan literal:

```tsx
/* ❌ Tidak semantic */
className = "text-orange-500";

/* ✅ Semantic */
className = "text-primary";
className = "text-destructive";
className = "text-muted-foreground";
```

### 6. **Component-Level Theme Handling**

```tsx
export function MyCard() {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg shadow">
      {/* Content automatically picks correct colors */}
    </div>
  );
}
```

---

## Summary

| Komponen          | Fungsi                                          | File                                          |
| ----------------- | ----------------------------------------------- | --------------------------------------------- |
| **globals.css**   | Definisi CSS variables & warna untuk light/dark | `src/app/globals.css`                         |
| **ThemeProvider** | React context provider untuk theme state        | `src/components/providers/theme-provider.tsx` |
| **ModeToggle**    | UI button untuk toggle antara mode              | `src/components/ui/mode-toogle.tsx`           |
| **next-themes**   | Library backend untuk theme management          | npm package                                   |

**Workflow Lengkap**:

1. User click ModeToggle button
2. `setTheme()` dipanggil
3. `next-themes` update localStorage & document class
4. CSS `.dark` selector applied
5. CSS variables override dengan dark mode values
6. Component re-render dengan warna baru

---

## Resources

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [OKLch Color Space](https://bottosson.github.io/posts/oklab/)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Web Accessibility (WCAG) Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)
- [CSS Custom Properties (Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
