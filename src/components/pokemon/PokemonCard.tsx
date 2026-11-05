import { Link } from 'expo-router'
import { Image, Pressable, StyleSheet, View, type ViewStyle } from 'react-native'
import { getPokemonArtwork } from '../../../functions/pokemon'
import { useThemeColors } from '../../../hooks/useThemeColors'
import Card from '../Card'
import ThemeText from '../ThemeText'

type PokemonCardProps = {
  style?: ViewStyle,
  id: number,
  name:string
}

export default function PokemonCard({style, id, name}: PokemonCardProps) {
    const colors = useThemeColors()
  return (
    <Link href={{pathname: '/pokemon/[id]', params: {id: id}}} asChild>
      <Pressable style={style}>
        <Card style={[  styles.card, style]}>
      <View style={[styles.shadow, { backgroundColor: colors.grayBackground }]} />
      <ThemeText style={styles.id} variant="caption" color="grayMedium">#{id.toString().padStart(3, '0')}</ThemeText>
      <Image 
        source={{uri: getPokemonArtwork(id)}}
        width={72} 
        height={72} 
    />
    <ThemeText style={{fontSize: 12, }}>{name}</ThemeText>
    </Card>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
    card:{
        position: 'relative',
        alignItems: 'center',
        padding: 4
    },
    id:{
        alignSelf: 'flex-end',
    },
    shadow:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 44,
        borderRadius: 7,
    }
})