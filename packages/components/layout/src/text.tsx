import {
  chakra,
  forwardRef,
  omitThemingProps,
  SystemProps,
  ThemingProps,
  useStyleConfig,
  HTMLChakraProps,
} from "@chakra-ui/system"
import { cx } from "@chakra-ui/shared-utils"
import { compact } from "@chakra-ui/object-utils"

export interface TextProps extends HTMLChakraProps<"p">, ThemingProps<"Text"> {
  /**
   * The CSS `text-align` property
   * @type SystemProps["textAlign"]
   */
  align?: SystemProps["textAlign"]
  /**
   * The CSS `text-decoration` property
   * @type SystemProps["textDecoration"]
   */
  decoration?: SystemProps["textDecoration"]
  /**
   * The CSS `text-transform` property
   * @type SystemProps["textTransform"]
   */
  casing?: SystemProps["textTransform"]
}

/**
 * Used to render texts or paragraphs.
 *
 * @see Docs https://chakra-ui.com/text
 */
export const Text = forwardRef<TextProps, "p">(function Text(props, ref) {
  const styles = useStyleConfig("Text", props)
  const { className, align, decoration, casing, ...rest } =
    omitThemingProps(props)

  const aliasedProps = compact({
    textAlign: props.align,
    textDecoration: props.decoration,
    textTransform: props.casing,
  })

  return (
    <chakra.p
      ref={ref}
      className={cx("chakra-text", props.className)}
      {...aliasedProps}
      {...rest}
      __css={styles}
    />
  )
})

Text.displayName = "Text"