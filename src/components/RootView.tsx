import { useEffect } from 'react'
import { StyleSheet, ViewProps } from 'react-native'
import Animated, {
  Easing,
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useThemeColors } from '../../hooks/useThemeColors'

type RootViewProps = ViewProps & {
    backgroundColor?: string
}

export default function RootView({
    style,
    backgroundColor,
    children,
    ...rest
}: RootViewProps) {
    const colors = useThemeColors()
    const progress = useSharedValue(0)

    useEffect(() => {
        if(backgroundColor){
          progress.value= 0
          progress.value = withTiming(1, { 
          duration: 500 ,
          easing: Easing.out(Easing.quad),
          reduceMotion: ReduceMotion.System
        })
        }
    }, [backgroundColor])

    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [colors.tint, backgroundColor ?? colors.tint]
        ),
    }))

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <SafeAreaView style={[styles.safeArea, style]} {...rest}>
                {children}
            </SafeAreaView>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        padding: 4,
    },
})