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
