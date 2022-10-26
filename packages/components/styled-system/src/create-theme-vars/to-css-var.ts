import { analyzeBreakpoints } from "@chakra-ui/breakpoint-utils"
import type { WithCSSVar } from "../utils"
import { createThemeVars } from "./create-theme-vars"
import { extractSemanticTokens, extractTokens, omitVars } from "./theme-tokens"
import { flattenTokens } from "./flatten-tokens"
import { createColorPalettesCssVars } from "./create-palette-vars"

export function toCSSVar<T extends Record<string, any>>(rawTheme: T) {
  /**
   * In the case the theme has already been converted to css-var (e.g. extending the theme),
   * we can omit the computed css vars and recompute it for the extended theme.
   */
  const theme = omitVars(rawTheme)

  // omit components and breakpoints from css variable map
  const tokens = extractTokens(theme)
  const semanticTokens = extractSemanticTokens(theme)
  const cssVarPrefix = theme.config?.cssVarPrefix
  const colorPalette = createColorPalettesCssVars(tokens, cssVarPrefix)
  const flatTokens = flattenTokens({
    tokens,
    semanticTokens: {
      ...semanticTokens,
      colors: {
        ...semanticTokens?.colors,
        ...colorPalette,
      },
    },
  })

  const {
    /**
     * This is more like a dictionary of tokens users will type `green.500`,
     * and their equivalent css variable.
     */
    cssMap,
    /**
     * The extracted css variables will be stored here, and used in
     * the emotion's <Global/> component to attach variables to `:root`
     */
    cssVars,
  } = createThemeVars(flatTokens, { cssVarPrefix })

  const defaultCssVars: Record<string, any> = {
    "--chakra-ring-inset": "var(--chakra-empty,/*!*/ /*!*/)",
    "--chakra-ring-offset-width": "0px",
    "--chakra-ring-offset-color": "#fff",
    "--chakra-ring-color": "rgba(66, 153, 225, 0.6)",
    "--chakra-ring-offset-shadow": "0 0 #0000",
    "--chakra-ring-shadow": "0 0 #0000",
    "--chakra-space-x-reverse": "0",
    "--chakra-space-y-reverse": "0",
  }

  Object.assign(theme, {
    __cssVars: { ...defaultCssVars, ...cssVars },
    __cssMap: cssMap,
    __breakpoints: analyzeBreakpoints(theme.breakpoints),
    __colorPalettes: generatePaletteVars(cssMap),
  })

  return theme as WithCSSVar<T>
}

function generatePaletteVars(
  cssMap: Record<string, { palette: string; varRef: string; var: string }>,
) {
  const result: Record<string, any> = {}

  for (const [key, token] of Object.entries(cssMap)) {
    const { palette } = token
    if (!palette) continue
    // group by palette
    result[palette] = result[palette] || {}
    const computedKey = key.replace(palette, "colorPalette")
    const computedKeyVar = cssMap[computedKey]?.var
    result[palette][computedKeyVar] = token.varRef
  }

  return result
}
