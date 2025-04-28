"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuItem
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center"
    >
      {theme === "light" ? (
        <>
          <Moon />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun />
          <span>Light Mode</span>
        </>
      )}
    </DropdownMenuItem>
  );
};

export default ModeToggle;
