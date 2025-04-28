"use client";

import { useTheme } from "next-themes";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export default function GeneralSettings() {
  const theme = useTheme();

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">General</h1>
        <p className="text-muted-foreground">
          General settings that affect the entire application.
        </p>
      </div>
      <Separator className="w-full my-4 h-[1px] bg-border" />

      <section className="flex items-center gap-4 w-full">
        <div className="flex items-center space-x-4">
          <Switch
            id="theme-toggle"
            checked={theme.theme === "dark"}
            onCheckedChange={() =>
              theme.setTheme(theme.theme === "dark" ? "light" : "dark")
            }
          />
          <Label htmlFor="theme-toggle">Dark Mode</Label>
        </div>
      </section>
    </>
  );
}
