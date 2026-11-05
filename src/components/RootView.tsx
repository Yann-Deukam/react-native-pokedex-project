import { StyleSheet, ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useThemeColors } from '../../hooks/useThemeColors'

type RootViewProps = ViewProps 

export default function RootView({ style, ...rest }: RootViewProps) {
  const colors = useThemeColors()
  return <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}, style]} {...rest}>

  </SafeAreaView>
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:4
  }
})