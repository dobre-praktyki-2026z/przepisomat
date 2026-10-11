const PALETTES: Array<[string, string]> = [
    ['#ff9a9e', '#fad0c4'],
    ['#a1c4fd', '#c2e9fb'],
    ['#fbc2eb', '#a6c1ee'],
    ['#fdcbf1', '#e6dee9'],
    ['#f6d365', '#fda085'],
    ['#84fab0', '#8fd3f4'],
    ['#cfd9df', '#e2ebf0'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
]

export function recipeImage(title: string, seed: number): string {
    const [from, to] = PALETTES[seed % PALETTES.length]
    const initials = title
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('')

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <circle cx="200" cy="150" r="92" fill="#ffffff" opacity="0.85"/>
  <circle cx="200" cy="150" r="68" fill="none" stroke="${to}" stroke-width="6" opacity="0.8"/>
  <text x="200" y="162" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="44" font-weight="700" fill="#3a3a3a" text-anchor="middle">${initials}</text>
</svg>`

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
