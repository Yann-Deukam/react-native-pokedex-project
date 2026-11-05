
import { useEffect } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated'

import { statShortName } from '../../../functions/pokemon'
import { useThemeColors } from '../../../hooks/useThemeColors'
import Row from '../Row'
import ThemeText from '../ThemeText'

type PokemonStats = ViewProps & {
    name: string,
    value: number,
    color: string
}

export default function PokemonStats({
    style,
    name,
    value,
    color,
    ...rest
}: PokemonStats) {
    const colors = useThemeColors()

    const animatedValue = useSharedValue(1)

    useEffect(() => {
        animatedValue.value = 1
        animatedValue.value = withTiming(
            Math.min(value, 255),
            { duration: 1000 }
        )
    }, [value])

    const animatedBarStyle = useAnimatedStyle(() => ({
        flex: animatedValue.value,
    }))

    const animatedBackgroundStyle = useAnimatedStyle(() => ({
        flex: 255 - animatedValue.value,
    }))

    return (
        <Row style={[style, styles.root]} {...rest}>
            <View style={[styles.name, { borderColor: colors.grayLight }]}>
                <ThemeText
                    variant='subtitle3'
                    style={{ color }}
                >
                    {statShortName(name)}
                </ThemeText>
            </View>

            <View style={styles.number}>
                <ThemeText variant='subtitle3'>
                    {value.toString().padStart(3, '0')}
                </ThemeText>
            </View>

            <Row style={styles.bar}>
                <Animated.View
                    style={[
                        styles.innerBar,
                        animatedBarStyle,
                        { backgroundColor: color },
                    ]}
                />

                <Animated.View
                    style={[
                        styles.innerBackground,
                        animatedBackgroundStyle,
                        { backgroundColor: color },
                    ]}
                />
            </Row>
        </Row>
    )
}

const styles = StyleSheet.create({
    root: {
    },
    name: {
        width: 40,
        paddingRight: 8,
        borderRightWidth: 1,
        borderStyle: 'solid',
    },
    number: {
        width: 40,
    },
    bar: {
        flex: 1,
        borderRadius: 4,
        height: 4,
        overflow: 'hidden',
    },
    innerBar: {
        height: 4,
    },
    innerBackground: {
        height: 4,
        opacity: 0.3,
    },
})
