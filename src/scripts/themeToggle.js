/**
 * Theme toggle functionality for light/dark mode.
 * Saves user preference in localStorage and updates CSS custom properties on the root element.
 * @module themeToggle
 */

const THEME_STORAGE_KEY = 'theme-preference';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

/**
 * Gets the system color scheme preference.
 * @returns {string} 'light' or 'dark'
 */
function getSystemPreference() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK_THEME;
  }
  return LIGHT_THEME;
}

/**
 * Retrieves the saved theme preference from localStorage.
 * Falls back to system preference if not saved.
 * @returns {string} 'light' or 'dark'
 */
function getSavedTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === LIGHT_THEME || stored === DARK_THEME) {
      return stored;
    }
  } catch (e) {
    console.warn('localStorage not available, using system preference', e);
  }
  return getSystemPreference();
}

/**
 * Applies the given theme by updating CSS custom properties and saving the preference.
 * @param {string} theme - 'light' or 'dark'
 */
function applyTheme(theme) {
  if (theme !== LIGHT_THEME && theme !== DARK_THEME) {
    console.error(`Invalid theme: ${theme}`);
    return;
  }

  const root = document.documentElement;
  const isDark = theme === DARK_THEME;

  // Update CSS custom properties based on design system
  root.style.setProperty('--color-background', isDark ? '#0f172a' : '#ffffff');
  root.style.setProperty('--color-text', isDark ? '#f8fafc' : '#0f172a');
  root.style.setProperty('--color-primary', '#2563eb');

  // Save preference
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.warn('Failed to save theme to localStorage', e);
  }

  // Add data attribute for additional styling hooks
  root.setAttribute('data-theme', theme);

  // Log the change
  console.log(`Theme set to ${theme}`);
}

/**
 * Toggles between light and dark themes.
 */
function toggleTheme() {
  const current = getSavedTheme();
  const next = current === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
  applyTheme(next);
}

/**
 * Initializes the theme toggle.
 * Sets the initial theme and attaches event listener to the toggle button.
 */
function initThemeToggle() {
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);

  const toggleButton = document.getElementById('theme-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleTheme);
  } else {
    console.warn('Theme toggle button (#theme-toggle) not found');
  }

  // Listen for system scheme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Only override if no explicit localStorage preference
    try {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
      }
    } catch (err) {
      console.warn('Error handling system preference change', err);
    }
  });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}