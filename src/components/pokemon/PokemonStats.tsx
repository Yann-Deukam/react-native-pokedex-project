import { StyleSheet, View, ViewProps } from 'react-native'
import { statShortName } from '../../../functions/pokemon'
import { useThemeColors } from '../../../hooks/useThemeColors'
import Row from '../Row'
import ThemeText from '../ThemeText'

type PokemonStats = ViewProps & {
    name: string,
    value: number,
    color: string
}

export default function PokemonStats({style, name, value, color, ...rest}: PokemonStats) {
    const colors = useThemeColors()
  return (
    <Row style={[style, styles.root]} {...rest}>
        <View style={[styles.name, {borderColor: colors.grayLight}]}>
            <ThemeText variant='subtitle3' style={{color: color}}>
                {statShortName(name)}
            </ThemeText>
        </View>
        <View style={styles.number}>
            <ThemeText variant='subtitle3'>{value.toString().padStart(3,'0')}</ThemeText>
        </View>
        <Row style={styles.bar}>
            <View style={[styles.innerBar, {flex: value, backgroundColor: color}]}></View>
            <View style={[styles.innerBackground, {flex: 255-value, backgroundColor: color}]}></View>
        </Row>
    </Row>
  )
}

const styles = StyleSheet.create({
    root: {

    },
    name: {
        width:40,
        paddingRight:8,
        borderRightWidth: 1,
        borderStyle:'solid'
    },
    number:{
        width: 40
    },
    bar:{
        flex:1,
        borderRadius:4,
        height:4,
        overflow: "hidden"
    },
    innerBar: {
        height: 4
    },
    innerBackground:{
        height: 4,
        opacity:0.3
    }
})