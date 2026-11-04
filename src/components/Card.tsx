import { View, type ViewProps, type ViewStyle } from 'react-native'
import { shadows } from '../../constants/shadows'
import { useThemeColors } from '../../hooks/useThemeColors'

type CardProps = ViewProps

export default function Card({style, ...rest}: CardProps) {
    const  colors = useThemeColors()
  return (
    <View style={[style, styles, {backgroundColor: colors.white}]}  {...rest} />
  )
}

const styles = {
    borderRadius: 8,
    ...shadows.dp2,
    overflow: 'hidden',
}satisfies ViewStyle 