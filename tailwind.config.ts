import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        home: '#0D0D0D',
        work: '#0F0E0C',
        about: '#0C0D0F',
        contact: '#0D0C0E',
        gold: '#C9A84C',
        ink: '#F0EBE3',
        muted: '#777777',
        line: '#2A2A2A',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      letterSpacing: {
        caps: '0.2em',
        label: '0.25em',
        wide: '0.3em',
      },
    },
  },
  plugins: [],
}
export default config
