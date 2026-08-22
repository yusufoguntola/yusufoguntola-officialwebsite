import { useEffect, useState } from "react";

function getInitialTheme() {
  return localStorage.getItem("theme") === "green" ? "green" : "brown";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (theme === "green") {
      document.documentElement.setAttribute("data-theme", "green");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const nextTheme = theme === "green" ? "brown" : "green";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-line text-ink/70 transition-colors hover:border-green hover:text-green-deep"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M4 21c7-1 13-6 15-15C11 6 5 12 4 21Z" />
        <path d="M4 21c3-3 6-6 10-11" />
      </svg>
    </button>
  );
}
