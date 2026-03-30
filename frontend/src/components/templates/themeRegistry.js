export const DEFAULT_THEME_VISUAL = {
  gradient: 'linear-gradient(165deg, #1e2a3a 0%, #355072 56%, #9ab3cc 100%)',
  accent: '#9ab3cc',
}

export const THEME_VISUALS = {
  classic: { gradient: 'linear-gradient(165deg, #2a1a0e 0%, #5b3721 56%, #c9a07a 100%)', accent: '#d9b28b' },
  romantic: { gradient: 'linear-gradient(165deg, #340d19 0%, #8b3050 58%, #d4788a 100%)', accent: '#f0b7c3' },
  modern: { gradient: 'linear-gradient(165deg, #101824 0%, #213f66 56%, #f5a623 100%)', accent: '#ffd274' },
  natural: { gradient: 'linear-gradient(165deg, #1d2b20 0%, #356246 56%, #7a9e7e 100%)', accent: '#b9d1b6' },
}

export function resolveThemeVisual(themeKey) {
  return THEME_VISUALS[themeKey] || DEFAULT_THEME_VISUAL
}
