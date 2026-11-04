import { StyleSheet, Text, type TextProps } from 'react-native'
import { Colors } from '../../constants/color'
import { useThemeColors } from '../../hooks/useThemeColors'

const styles = StyleSheet.create({
    body3: {
        fontSize: 20,
        lineHeight: 16,
    },
    headline:{
        fontSize: 24,
        lineHeight: 32,
        fontWeight: 'bold',
    },
    caption:{
        fontSize: 8,
        lineHeight: 12,
    },
    subtitle1:{
        fontSize: 14,
        lineHeight: 16,
        fontWeight: 'bold',
    },
    subtitle2:{
        fontSize: 12,
        lineHeight: 16,
        fontWeight: 'bold',
    },
    subtitle3:{
        fontSize: 10,
        lineHeight: 16,
        fontWeight: 'bold',
    },

})

type Props = TextProps & {
    variant?: keyof typeof styles,
    color?: keyof typeof Colors["light"],
}

export default function ThemeText({variant, color, ...rest}: Props) {
    const colors = useThemeColors()
  return (
      <Text
            {...rest} style={[styles[variant ?? 'body3'], { color: colors[color ?? "grayDark"]}]}
        />
  )
}

