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
import { useEffect, useMemo, useRef, useState } from 'react'
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    useWindowDimensions,
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

type Entry = {
    id: number
    name: string
}

const getIdFromUrl = (url: string) => {
    const parts = url.split('/').filter(Boolean)
    return Number(parts[parts.length - 1])
}

export default function Pokemon() {
    const params = useLocalSearchParams<{ id: string }>()
    const identifier = params.id ?? ''

    const { width } = useWindowDimensions()
    const queryClient = useQueryClient()
    const listRef = useRef<FlatList<Entry>>(null)

    // The full directory (regular Pokémon and forms), in order.
    // Usually already cached from the Pokedex screen.
    const { data: directory, isError } = useFetchQuery(
        '/pokemon?limit=2000&offset=0'
    )

    const entries = useMemo<Entry[]>(
        () =>
            (directory?.results ?? []).map(pokemon => ({
                id: getIdFromUrl(pokemon.url),
                name: pokemon.name,
            })),
        [directory]
    )

    // undefined = still loading, -1 = not found
    const startIndex = useMemo<number | undefined>(() => {
        if (isError) return -1
        if (!directory) return undefined

        const isNumeric = /^\d+$/.test(identifier)

        return entries.findIndex(entry =>
            isNumeric
                ? entry.id === Number(identifier)
                : entry.name === identifier
        )
    }, [identifier, directory, isError, entries])

    // Warm the cache around the page being opened
    useEffect(() => {
        if (startIndex !== undefined && startIndex >= 0) {
            prefetchAround(queryClient, entries, startIndex)
        }
    }, [startIndex, entries, queryClient])

    if (startIndex === undefined) {
        return <RootView />
    }

    if (startIndex < 0) {
        return (
            <RootView>
                <ThemeText color="grayLight">Pokémon not found.</ThemeText>
            </RootView>
        )
    }

    // Keep the URL in step with the visible page. The list is never rebuilt.
    const syncUrl = (index: number) => {
        const entry = entries[index]
        if (!entry) return

        prefetchAround(queryClient, entries, index)

        if (String(entry.id) !== identifier) {
            router.setParams({ id: String(entry.id) })
        }
    }

    const goTo = (index: number) => {
        if (index < 0 || index >= entries.length) return
        listRef.current?.scrollToIndex({ index, animated: true })
        syncUrl(index)
    }

    const onMomentumScrollEnd = (e: {
        nativeEvent: { contentOffset: { x: number } }
    }) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width)
        syncUrl(index)
    }

    return (
        <FlatList
            ref={listRef}
            data={entries}
            keyExtractor={entry => String(entry.id)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={startIndex}
            getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
            })}
            initialNumToRender={3}
            windowSize={5}
            maxToRenderPerBatch={3}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={({ item, index }) => (
                <View style={{ width, flex: 1 }}>
                    <PokemonView
                        id={item.id}
                        hasPrevious={index > 0}
                        hasNext={index < entries.length - 1}
                        onPrevious={() => goTo(index - 1)}
                        onNext={() => goTo(index + 1)}
                    />
                </View>
            )}
            style={{ flex: 1 }}
        />
    )
}

// Load data and artwork for the entries either side of `index`.
// Species is fetched by name, because forms share their base species.
function prefetchAround(
    queryClient: ReturnType<typeof useQueryClient>,
    entries: Entry[],
    index: number
) {
    ;[index - 2, index - 1, index + 1, index + 2].forEach(i => {
        const entry = entries[i]
        if (entry) prefetchEntry(queryClient, entry.id)
    })
}

async function prefetchEntry(
    queryClient: ReturnType<typeof useQueryClient>,
    id: number
) {
    try {
        const pokemon = await prefetchFetchQuery(queryClient, '/pokemon/[id]', {
            id,
        })
        Image.prefetch(getPokemonArtwork(id))

        if (pokemon?.species?.name) {
            await prefetchFetchQuery(queryClient, '/pokemon-species/[id]', {
                id: pokemon.species.name,
            })
        }
    } catch {
        // Prefetch is best-effort; the screen fetches again if needed
    }
}

type PokemonViewProps = {
    id: number
    hasPrevious: boolean
    hasNext: boolean
    onPrevious: () => void
    onNext: () => void
}

function PokemonView({
    id,
    hasPrevious,
    hasNext,
    onPrevious,
    onNext,
}: PokemonViewProps) {
    const colors = useThemeColors()
    const [artworkFailed, setArtworkFailed] = useState(false)

    const { data: pokemon } = useFetchQuery('/pokemon/[id]', { id })

    // Species is fetched by the name the Pokémon data gives us
    const { data: species } = useFetchQuery('/pokemon-species/[id]', {
        id: pokemon?.species.name ?? '',
    })

    const mainType = pokemon?.types?.[0]?.type.name
    const colorType = mainType ? Colors.type[mainType] : colors.tint
    const types = pokemon?.types ?? []

    const bio = species?.flavor_text_entries
        ?.find(({ language }) => language.name === 'en')
        ?.flavor_text.replace(/[\n\f]/g, ' ')

    const player = useAudioPlayer(pokemon?.cries.latest ?? null)

    const onImagePress = () => {
        if (!pokemon?.cries.latest) return
        player.play()
    }

    // Empty page until data is ready, so no default colours flash in
    if (!pokemon) {
        return <RootView />
    }

    return (
        <RootView backgroundColor={colorType}>
            <View style={{ flex: 1 }}>
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
                                {pokemon.name}
                            </ThemeText>
                        </Row>
                    </Pressable>

                    <ThemeText color="white" variant="subtitle2">
                        #{id.toString().padStart(3, '0')}
                    </ThemeText>
                </Row>

                <Card style={styles.card}>
                    <Row style={styles.imageRow}>
                        {hasPrevious ? (
                            <Pressable
                                onPress={onPrevious}
                                hitSlop={12}
                                style={styles.navigationButton}
                            >
                                <Image
                                    source={require('@/assets/images/prev.png')}
                                    style={styles.navigation}
                                    resizeMode="contain"
                                />
                            </Pressable>
                        ) : (
                            <View style={styles.navigationPlaceholder} />
                        )}

                        <Pressable onPress={onImagePress}>
                            <Image
                                style={styles.artwork}
                                source={{
                                    uri: artworkFailed
                                        ? (pokemon.sprites.front_default ?? undefined)
                                        : getPokemonArtwork(id),
                                }}
                                onError={() => setArtworkFailed(true)}
                                resizeMode="contain"
                            />
                        </Pressable>

                        {hasNext ? (
                            <Pressable
                                onPress={onNext}
                                hitSlop={12}
                                style={styles.navigationButton}
                            >
                                <Image
                                    source={require('@/assets/images/next.png')}
                                    style={styles.navigation}
                                    resizeMode="contain"
                                />
                            </Pressable>
                        ) : (
                            <View style={styles.navigationPlaceholder} />
                        )}
                    </Row>

                    <Row gap={8} style={{ height: 20 }}>
                        {types.map(type => (
                            <PokemonType
                                name={type.type.name}
                                key={type.type.name}
                            />
                        ))}
                    </Row>

                    <ThemeText variant="subtitle1" style={{ color: colorType }}>
                        About
                    </ThemeText>

                    <Row>
                        <PokemonSpecs
                            title={formatWeight(pokemon.weight)}
                            desc="weight"
                            image={require('@/assets/images/weight.png')}
                        />

                        <PokemonSpecs
                            title={formatSize(pokemon.height)}
                            desc="Height"
                            image={require('@/assets/images/height.png')}
                        />

                        <PokemonSpecs
                            title={pokemon.moves
                                .slice(0, 2)
                                .map(m => m.move.name)
                                .join('\n')}
                            desc="Abilities"
                        />
                    </Row>

                    <ThemeText variant="subtitle1">{bio}</ThemeText>

                    <Row>
                        <ThemeText variant="subtitle1" style={{ color: colorType }}>
                            Base Stats:
                        </ThemeText>

                        <ThemeText variant="subtitle1" style={{ fontWeight: 'bold' }}>
                            {pokemon.stats.reduce(
                                (total, stat) => total + stat.base_stat,
                                0
                            )}
                        </ThemeText>
                    </Row>

                    <View style={{ alignSelf: 'stretch' }}>
                        {pokemon.stats.map(stat => (
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

    navigationButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        elevation: 20,
    },

    navigation: {
        width: 24,
        height: 24,
        opacity: 0.7,
    },

    navigationPlaceholder: {
        width: 32,
        height: 32,
    },
})