
import { useState } from 'react'
import {
    Image,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import { useThemeColors } from '../../hooks/useThemeColors'
import Card from './Card'
import { Radio } from './Radio'
import Row from './Row'
import ThemeText from './ThemeText'

type SortButtonProps = {
    value: 'id' | 'name'
    onChange: (value: 'id' | 'name') => void
}

export default function SortButton({ value, onChange }: SortButtonProps) {
    const colors = useThemeColors()
    const [isOpen, setIsOpen] = useState(false)

    const options = [
        { label: 'Number', value: 'id' },
        { label: 'Name', value: 'name' },
    ] as const

    const handleOptionPress = (option: 'id' | 'name') => {
        onChange(option)
        setIsOpen(false)
    }

    return (
        <View style={styles.container}>
            {/* Sort button */}
            <Pressable
                onPress={() => setIsOpen(previous => !previous)}
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: colors.white },
                    pressed && styles.pressed,
                ]}
                hitSlop={8}
            >
                <Image
                    source={
                        value === 'id'
                            ? require('@/assets/images/sort-az.png')
                            : require('@/assets/images/filters.png')
                    }
                    style={styles.icon}
                    resizeMode="contain"
                />
            </Pressable>

            {/* Dropdown */}
            {isOpen && (
                <View
                    style={[
                        styles.dropdown,
                        { backgroundColor: colors.tint },
                    ]}
                >
                    <ThemeText variant="subtitle2" color="white">
                        Sort by
                    </ThemeText>

                    <Card style={styles.options}>
                        {options.map(option => (
                            <Pressable
                                key={option.value}
                                onPress={() => handleOptionPress(option.value)}
                                style={styles.option}
                            >
                                <Row gap={8}>
                                    <Radio checked={option.value === value} />
                                    <ThemeText variant="body3">
                                        {option.label}
                                    </ThemeText>
                                </Row>
                            </Pressable>
                        ))}
                    </Card>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 100,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 22,
        height: 22,
    },
    pressed: {
        opacity: 0.7,
    },
    dropdown: {
        position: 'absolute',
        top: 52,
        right: 0,
        width: 150,
        padding: 12,
        borderRadius: 8,
        gap: 10,
        zIndex: 1000,
        elevation: 8,
    },
    options: {
        gap: 4,
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 8
    },
})
