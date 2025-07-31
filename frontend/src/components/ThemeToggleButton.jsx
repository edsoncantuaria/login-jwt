import { Sun, Moon } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";

function ThemeToggleButton() {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <button
      onClick={typeof toggleTheme === "function" ? toggleTheme : undefined}
      className="px-3 py-1 text-sm border rounded-md 
                   bg-gray-100 dark:bg-gray-800 dark:text-white 
                   hover:bg-gray-200 dark:hover:bg-gray-700 
                   transition"
      id="theme-toggle-button"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}

export default ThemeToggleButton;
