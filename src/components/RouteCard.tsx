import { router } from 'expo-router'
import { Image, Pressable, StyleSheet, type ViewStyle } from 'react-native'

import ThemeText from '@/components/ThemeText'
import { NavItem } from '../../constants/routes'

type RouteCardProps = NavItem & {
    style?: ViewStyle
}

export default function RouteCard({ label, color, route, style }: RouteCardProps) {
    return (
        <Pressable
            disabled={!route}
            onPress={() => {
                if (route) router.push(route)
            }}
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: color },
                pressed && route && styles.pressed,
                style,
            ]}
        >
            <Image
                source={require('@/assets/images/pokeball.png')}
                style={styles.watermark}
                resizeMode="contain"
            />

            <ThemeText style={styles.label}>{label}</ThemeText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 8,
        padding: 16,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },

    pressed: {
        opacity: 0.85,
    },

    watermark: {
        position: 'absolute',
        top: 40,
        right: -16,
        width: 110,
        height: 110,
        opacity: 0.25,
    },

    label: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
    },
})