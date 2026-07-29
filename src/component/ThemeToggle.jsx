import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2.25v2M12 19.75v2M2.25 12h2M19.75 12h2M5.1 5.1l1.42 1.42M17.48 17.48l1.42 1.42M18.9 5.1l-1.42 1.42M6.52 17.48 5.1 18.9" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.25 15.35A8.6 8.6 0 0 1 8.65 3.75a8.6 8.6 0 1 0 11.6 11.6Z" />
    <path className="moon-star moon-star-one" d="m16.7 5.1.35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35Z" />
    <path className="moon-star moon-star-two" d="m19.2 9.1.22.55.55.22-.55.22-.22.55-.22-.55-.55-.22.55-.22Z" />
  </svg>
);

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={isDark}
      title={`Switch to ${nextTheme} mode`}
    >
      <span className="theme-toggle__glow" aria-hidden="true" />
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__icon theme-toggle__icon--sun">
          <SunIcon />
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--moon">
          <MoonIcon />
        </span>
        <span className="theme-toggle__thumb">
          <span className="theme-toggle__thumb-icon theme-toggle__thumb-sun">
            <SunIcon />
          </span>
          <span className="theme-toggle__thumb-icon theme-toggle__thumb-moon">
            <MoonIcon />
          </span>
        </span>
      </span>
      <span className="sr-only">
        {isDark ? "Dark mode enabled" : "Light mode enabled"}
      </span>
    </button>
  );
};

export default ThemeToggle;
