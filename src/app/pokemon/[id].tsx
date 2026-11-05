import Card from '@/components/Card'
import PokemonSpecs from '@/components/pokemon/PokemonSpecs'
import PokemonStats from '@/components/pokemon/PokemonStats'
import PokemonType from '@/components/pokemon/PokemonType'
import RootView from '@/components/RootView'
import Row from '@/components/Row'
import ThemeText from '@/components/ThemeText'
import { useQueryClient } from '@tanstack/react-query'
import { useAudioPlayer } from 'expo-audio'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import { Colors } from '../../../constants/color'
import {
  formatSize,
  formatWeight,
  getPokemonArtwork,
} from '../../../functions/pokemon'
import {
  prefetchFetchQuery,
  useFetchQuery,
} from '../../../hooks/useFetchQuery'
import { useThemeColors } from '../../../hooks/useThemeColors'

const MIN_ID = 1
const MAX_ID = 2000
const SCREEN_WIDTH = Dimensions.get('window').width

// One entry per Pokemon, #1 to #2000
const IDS = Array.from({ length: MAX_ID - MIN_ID + 1 }, (_, i) => MIN_ID + i)

export default function Pokemon() {
  const params = useLocalSearchParams<{ id: string }>()
  const startId = Math.min(Math.max(parseInt(params.id, 10) || MIN_ID, MIN_ID), MAX_ID)
  const id = startId
  const listRef = useRef<FlatList<number>>(null)
  const queryClient = useQueryClient()

  // Keep neighbours' data and artwork loaded before the user gets to them
  useEffect(() => {
    ;[id - 2, id - 1, id + 1, id + 2]
      .filter((n) => n >= MIN_ID && n <= MAX_ID)
      .forEach((n) => {
        prefetchFetchQuery(queryClient, '/pokemon/[id]', { id: n })
        prefetchFetchQuery(queryClient, '/pokemon-species/[id]', { id: n })
        Image.prefetch(getPokemonArtwork(n))
      })
  }, [id, queryClient])

  // Called when a swipe settles on a new page
  const onMomentumScrollEnd = (e: {
    nativeEvent: { contentOffset: { x: number } }
  }) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    const newId = IDS[index]
    if (newId !== undefined && newId !== id) {
      // Update the URL only. The list is not rebuilt, so no page re-mounts.
      router.setParams({ id: String(newId) })
    }
  }

  // Used by the prev/next arrow buttons
  const goTo = (newId: number) => {
    const clamped = Math.min(Math.max(newId, MIN_ID), MAX_ID)
    listRef.current?.scrollToIndex({
      index: clamped - MIN_ID,
      animated: true,
    })
    router.setParams({ id: String(clamped) })
  }

  return (
    <FlatList
      ref={listRef}
      data={IDS}
      keyExtractor={(item) => String(item)}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={startId - MIN_ID}
      getItemLayout={(_, index) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
      })}
      // Keep the neighbours mounted off-screen so they're ready on swipe
      initialNumToRender={3}
      windowSize={5}
      maxToRenderPerBatch={3}
      removeClippedSubviews={false}
      onMomentumScrollEnd={onMomentumScrollEnd}
      renderItem={({ item }) => (
        <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
          <PokemonView
            id={item}
            onPrevious={() => goTo(item - 1)}
            onNext={() => goTo(item + 1)}
          />
        </View>
      )}
      style={{ flex: 1 }}
    />
  )
}

type PokemonViewProps = {
  id: number
  onPrevious: () => void
  onNext: () => void
}

function PokemonView({ id, onPrevious, onNext }: PokemonViewProps) {
  const colors = useThemeColors()

  const { data: pokemon } = useFetchQuery('/pokemon/[id]', { id })
  const { data: species } = useFetchQuery('/pokemon-species/[id]', { id })

  const mainType = pokemon?.types?.[0].type.name
  const colorType = mainType ? Colors.type[mainType] : colors.tint
  const types = pokemon?.types ?? []

  const bio = species?.flavor_text_entries
    ?.find(({ language }) => language.name === 'en')
    ?.flavor_text.replaceAll('\n', '. ')

  const player = useAudioPlayer(pokemon?.cries.latest)

  const onImagePress = () => {
    if (!pokemon?.cries.latest) return

    player.replace(pokemon.cries.latest)
    player.play()
  }

  return (
    <RootView backgroundColor={colorType}>
      <View>
        <Image
          source={require('@/assets/images/pokeball_bg.png')}
          style={styles.pokeball}
        />

        <Row style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Row gap={8}>
              <Image
                source={require('@/assets/images/left-chevron.png')}
                style={{ width: 28, height: 28 }}
              />

              <ThemeText
                color="white"
                variant="headline"
                style={{ textTransform: 'capitalize' }}
              >
                {pokemon?.name}
              </ThemeText>
            </Row>
          </Pressable>

          <ThemeText color="white" variant="subtitle2">
            #{id.toString().padStart(3, '0')}
          </ThemeText>
        </Row>

        <Card style={styles.card}>
          <Row style={styles.imageRow}>
            {id === MIN_ID ? (
              <View style={{ width: 24, height: 24 }} />
            ) : (
              <Pressable onPress={onPrevious}>
                <Image
                  source={require('@/assets/images/prev.png')}
                  style={styles.navigation}
                />
              </Pressable>
            )}

            <Pressable onPress={onImagePress}>
              <Image
                style={styles.artwork}
                source={{ uri: getPokemonArtwork(id) }}
              />
            </Pressable>

            {id === MAX_ID ? (
              <View style={{ width: 24, height: 24 }} />
            ) : (
              <Pressable onPress={onNext}>
                <Image
                  source={require('@/assets/images/next.png')}
                  style={styles.navigation}
                />
              </Pressable>
            )}
          </Row>

          <Row gap={8} style={{ height: 20 }}>
            {types.map((type) => (
              <PokemonType name={type.type.name} key={type.type.name} />
            ))}
          </Row>

          <ThemeText variant="subtitle1" style={{ color: colorType }}>
            About
          </ThemeText>

          <Row>
            <PokemonSpecs
              title={formatWeight(pokemon?.weight)}
              desc="weight"
              image={require('@/assets/images/weight.png')}
            />

            <PokemonSpecs
              title={formatSize(pokemon?.height)}
              desc="Height"
              image={require('@/assets/images/height.png')}
            />

            <PokemonSpecs
              title={pokemon?.moves
                .slice(0, 2)
                .map((m) => m.move.name)
                .join('\n')}
              desc="Abilities"
            />
          </Row>

          <ThemeText variant="subtitle1">{bio}</ThemeText>

          <Row>
            <ThemeText variant="subtitle1" style={{ color: colorType }}>
              Base Stats :
            </ThemeText>
            <ThemeText variant="subtitle1" style={{ fontWeight: 'bold' }}>
              {pokemon?.stats.reduce(
                (total, stat) => total + stat.base_stat,
                0
              ) ?? 0}
            </ThemeText>
          </Row>

          <View style={{ alignSelf: 'stretch' }}>
            {pokemon?.stats.map((stat) => (
              <PokemonStats
                key={stat.stat.name}
                name={stat.stat.name}
                value={stat.base_stat}
                color={colorType}
              />
            ))}
          </View>
        </Card>
      </View>
    </RootView>
  )
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: 10,
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  pokeball: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 208,
    height: 208,
  },
  artwork: {
    width: 200,
    height: 200,
  },
  card: {
    marginTop: 144,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
    gap: 20,
    paddingBottom: 20,
    overflow: 'visible',
  },
  imageRow: {
    position: 'absolute',
    top: -140,
    zIndex: 10,
    elevation: 10,
    justifyContent: 'space-between',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  navigation: {
    width: 24,
    height: 24,
    opacity: 0.7,
  },
})