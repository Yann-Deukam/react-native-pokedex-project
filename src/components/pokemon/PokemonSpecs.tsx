
import {
    Image,
    type ImageSourcePropType,
    StyleSheet,
    View,
    type ViewProps,
} from 'react-native'

import Row from '../Row'
import ThemeText from '../ThemeText'

type PokemonSpecProps = ViewProps & {
    title?: string
    desc?: string
    image?: ImageSourcePropType
}

export default function PokemonSpecs({
    style,
    image,
    title,
    desc,
    ...rest
}: PokemonSpecProps) {
    return (
        <View style={[styles.root, style]} {...rest}>
            <Row style={styles.row} gap={6}>
                {image && (
                    <Image
                        source={image}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                )}
                <ThemeText
                    variant="subtitle2"
                    style={styles.title}
                >
                    {title}
                </ThemeText>
            </Row>
                <ThemeText
                    variant="caption"
                    color="grayMedium"
                    style={styles.description}
                >
                    {desc}
                </ThemeText>

            
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    row: {
        justifyContent: 'center',
        height: 30,
    },
    icon: {
        width: 16,
        height: 16,
    },
    description: {
        textTransform: 'capitalize',
    },
    title: {
        textAlign: 'center',
        textTransform: 'capitalize',
    },
})
