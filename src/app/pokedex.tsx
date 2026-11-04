import ThemeText from '@/components/ThemeText'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useThemeColors } from '../../hooks/useThemeColors'

export default function pokedex() {
    const colors = useThemeColors()
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]}>
      <ThemeText variant="headline"color="white">Pokedex</ThemeText>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})