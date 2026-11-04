import { Image, StyleSheet, TextInput } from 'react-native'
import { useThemeColors } from '../../hooks/useThemeColors'
import Row from './Row'

type SearchBarProps = {
    value: string
    onChange: (s: string) => void
    placeholder?: string
}

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Search Pokémon',
}: SearchBarProps) {
    const colors = useThemeColors()

    return (
        <Row style={[styles.wrapper, { backgroundColor: colors.white }]}>
            <Image
                source={require('@/assets/images/search.png')}
                style={styles.icon}
                resizeMode="contain"
            />

            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor={colors.grayMedium}
                style={styles.input}
            />
        </Row>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        height: 44,
        paddingHorizontal: 12,
        gap: 10,
    },
    icon: {
        width: 20,
        height: 20,
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 0,
    },
})