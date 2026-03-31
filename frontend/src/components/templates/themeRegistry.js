export const THEME_OPTIONS = [
  { key: 'classic', name: 'Classic Editorial', mood: 'Elegant and timeless', tagline: 'Timeless elegance with editorial typography and warm gold accents' },
  { key: 'romantic', name: 'Romantic Floral', mood: 'Soft and intimate', tagline: 'Soft florals, rose tones and delicate details for a warm celebration' },
  { key: 'modern', name: 'Modern Minimal', mood: 'Bold and contemporary', tagline: 'Sharp contrast, clean spacing and a confident modern layout' },
  { key: 'natural', name: 'Botanical Garden', mood: 'Fresh and organic', tagline: 'Greenery, soft neutrals and a calm garden-party atmosphere' },
  { key: 'old-money', name: 'Old Money Monogram', mood: 'Understated luxury', tagline: 'Cream, black and heritage-style details with quiet luxury energy' },
  { key: 'monochrome', name: 'Black and White Chic', mood: 'Fashion-forward', tagline: 'Monochrome contrast with a gallery-like editorial attitude' },
  { key: 'rustic', name: 'Rustic Countryside', mood: 'Warm and grounded', tagline: 'Earthy textures and countryside warmth for barn and vineyard weddings' },
  { key: 'destination', name: 'Destination Escape', mood: 'Sunlit and coastal', tagline: 'Travel-inspired styling for beach, villa and destination weddings' },
  { key: 'illustrated', name: 'Venue Illustration', mood: 'Personal and bespoke', tagline: 'A bespoke-feeling layout built around a venue or place-story moment' },
  { key: 'photo-story', name: 'Photo Story', mood: 'Personal and cinematic', tagline: 'Large photography moments and story-led sections for digital-first invites' },
  { key: 'whimsical', name: 'Whimsical Fairytale', mood: 'Playful and dreamy', tagline: 'Pastels, bows and hand-drawn charm with a soft fairytale mood' },
  { key: 'dark-romance', name: 'Dark Romance', mood: 'Moody and dramatic', tagline: 'Deep florals, candlelit tones and a dramatic evening atmosphere' },
]

export const DEFAULT_THEME_VISUAL = {
  gradient: 'linear-gradient(165deg, #1e2a3a 0%, #355072 56%, #9ab3cc 100%)',
  accent: '#9ab3cc',
}

export const THEME_VISUALS = {
  classic: { gradient: 'linear-gradient(165deg, #2a1a0e 0%, #5b3721 56%, #c9a07a 100%)', accent: '#d9b28b' },
  romantic: { gradient: 'linear-gradient(165deg, #340d19 0%, #8b3050 58%, #d4788a 100%)', accent: '#f0b7c3' },
  modern: { gradient: 'linear-gradient(165deg, #101824 0%, #213f66 56%, #f5a623 100%)', accent: '#ffd274' },
  natural: { gradient: 'linear-gradient(165deg, #1d2b20 0%, #356246 56%, #7a9e7e 100%)', accent: '#b9d1b6' },
  'old-money': { gradient: 'linear-gradient(165deg, #171311 0%, #4d3c32 56%, #dbc3a3 100%)', accent: '#e5d0b3' },
  monochrome: { gradient: 'linear-gradient(165deg, #0b0b0b 0%, #444444 56%, #d7d7d7 100%)', accent: '#efefef' },
  rustic: { gradient: 'linear-gradient(165deg, #33211a 0%, #845a3b 56%, #d0a77f 100%)', accent: '#f0cfab' },
  destination: { gradient: 'linear-gradient(165deg, #0d3b57 0%, #2a7ca5 56%, #ffd39f 100%)', accent: '#ffe1b9' },
  illustrated: { gradient: 'linear-gradient(165deg, #21324f 0%, #516f94 56%, #e0c8a5 100%)', accent: '#f0dec6' },
  'photo-story': { gradient: 'linear-gradient(165deg, #1f2433 0%, #61536b 56%, #e3b3a2 100%)', accent: '#f1d0c6' },
  whimsical: { gradient: 'linear-gradient(165deg, #5a436d 0%, #c384a6 56%, #f7d7b8 100%)', accent: '#ffe7d4' },
  'dark-romance': { gradient: 'linear-gradient(165deg, #120b14 0%, #4b1733 56%, #a2475a 100%)', accent: '#efb7c2' },
}

export const THEME_LOOKUP = Object.fromEntries(THEME_OPTIONS.map((theme) => [theme.key, theme]))

export function resolveThemeVisual(themeKey) {
  return THEME_VISUALS[themeKey] || DEFAULT_THEME_VISUAL
}

export function resolveThemeMeta(themeKey) {
  return THEME_LOOKUP[themeKey] || THEME_LOOKUP.classic
}
