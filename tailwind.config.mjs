/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'brand-base': 'var(--color-brand-base)',
        'brand-icon': 'var(--color-brand-icon)',
        'brand-text': 'var(--color-brand-text)',
        'accent-base': 'var(--color-accent-base)',
        'accent-subtle': 'var(--color-accent-subtle)',
        'neutral-base': 'var(--color-neutral-base)',
        'neutral-muted': 'var(--color-neutral-muted)',
        'neutral-inverse-muted': 'var(--color-neutral-inverse-muted)',
        'neutral-inverse-icon': 'var(--color-neutral-inverse-icon)',
        'semantic-error': 'var(--color-semantic-error)',
        'text-base': 'var(--color-text-base)',
        'text-muted': 'var(--color-text-muted)',
        'surface-error': 'var(--color-surface-error)',
        'sidebar-bg': 'var(--color-sidebar-bg)',
      },
    },
  },
  plugins: [],
};
