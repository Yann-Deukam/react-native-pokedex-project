import { View, type ViewProps, type ViewStyle } from 'react-native'

type RowProps = ViewProps & {
    gap?: number
}

export default function Row({ style, gap, ...rest }: RowProps) {
    return (
        <View
            {...rest}
            style={[
                rowStyle,
                style,
                gap !== undefined ? { gap } : undefined,
            ]}
        />
    )
}

const rowStyle = {
    flexDirection: 'row',
    alignItems: 'center',
} satisfies ViewStyle