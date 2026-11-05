import { Link } from 'expo-router'
import React from 'react'
import { Image, Pressable, StyleSheet, View, ViewStyle } from 'react-native'
import { getPokemonArtwork } from '../../../functions/pokemon'
import { useThemeColors } from '../../../hooks/useThemeColors'
import Card from '../Card'
import ThemeText from '../ThemeText'

type PokemonCardProps = {
  style?: ViewStyle
  id: number
  name: string
}

export default function PokemonCard({ style, id, name }: PokemonCardProps) {
  const colors = useThemeColors()
  const [imageUri, setImageUri] = React.useState(getPokemonArtwork(id))

  const handleImageError = () => {
    const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

    if (imageUri !== fallback) {
      setImageUri(fallback)
    }
  }

  return (
    <Link
      href={{
        pathname: '/pokemon/[id]',
        params: { id: name },
      }}
      asChild
    >
      <Pressable style={style}>
        <Card style={styles.card}>
          <View
            style={[
              styles.shadow,
              { backgroundColor: colors.grayBackground },
            ]}
          />

          <ThemeText
            style={styles.id}
            variant="caption"
            color="grayMedium"
          >
            #{id.toString().padStart(3, '0')}
          </ThemeText>

          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
            onError={handleImageError}
          />

          <ThemeText style={{ fontSize: 12 }}>
            {name}
          </ThemeText>
        </Card>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    alignItems: 'center',
    padding: 4,
  },
  id: {
    alignSelf: 'flex-end',
  },
  image: {
    width: 72,
    height: 72,
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    borderRadius: 7,
  },
})