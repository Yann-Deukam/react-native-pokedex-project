import Card from '@/components/Card'
import PokemonCard from '@/components/pokemon/PokemonCard'
import Row from '@/components/Row'
import SearchBar from '@/components/SearchBar'
import SortButton from '@/components/SortButton'
import ThemeText from '@/components/ThemeText'

import { useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
} from 'react-native'

import RootView from '@/components/RootView'
import { getPokemonIdFromUrl } from '../../functions/pokemon'
import { useFetchQuery } from '../../hooks/useFetchQuery'
import { useThemeColors } from '../../hooks/useThemeColors'

const PAGE_SIZE = 21

export default function Pokedex() {
    const colors = useThemeColors()

    // Fetch the full Pokémon directory (regular Pokémon and alternate forms)
    const { data, isLoading, isError } = useFetchQuery(
        "/pokemon?limit=2000&offset=0"
    )

    const [search, setSearch] = useState("")
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const [sortKey, setSortKey] = useState<"id" | "name">("id")

    // Get Pokémon names and IDs
    const pokemons = useMemo(() => {
        return (data?.results ?? []).map(pokemon => ({
            name: pokemon.name,
            id: getPokemonIdFromUrl(pokemon.url),
        }))
    }, [data])

    // Filter and sort Pokémon
    const filteredPokemons = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        const filtered = pokemons.filter(pokemon => {
            if (!normalizedSearch) return true

            return (
                pokemon.name.toLowerCase().includes(normalizedSearch) ||
                pokemon.id.toString() === normalizedSearch
            )
        })

        return [...filtered].sort((a, b) => {
            if (sortKey === "id") {
                return a.id - b.id
            }

            return a.name.localeCompare(b.name)
        })
    }, [pokemons, search, sortKey])

    // Display results in batches of 21
    const displayedPokemons = filteredPokemons.slice(0, visibleCount)

    if (isLoading) {
        return (
            <RootView>
                <ActivityIndicator size="large" color={colors.grayLight} />
            </RootView>
        )
    }

    if (isError) {
        return (
            <RootView>
                <ThemeText color="grayLight">
                    Failed to load Pokémon.
                </ThemeText>
            </RootView>
        )
    }

    return (
        <RootView>
            <Row style={styles.header} gap={12}>
                <Image
                    source={require('@/assets/images/pokeball.png')}
                    style={{ width: 24, height: 24 }}
                />

                <ThemeText variant="headline" color="grayLight">
                    Pokedex
                </ThemeText>
            </Row>

            <Row style={styles.search} gap={12}>
                <SearchBar
                    value={search}
                    onChange={value => {
                        setSearch(value)
                        setVisibleCount(PAGE_SIZE)
                    }}
                />

                <SortButton
                    value={sortKey}
                    onChange={setSortKey}
                />
            </Row>

            <Card style={styles.body}>
                <FlatList
                    data={displayedPokemons}
                    numColumns={3}
                    contentContainerStyle={[styles.gridGap, styles.list]}
                    columnWrapperStyle={styles.gridGap}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <PokemonCard
                            id={item.id}
                            name={item.name}
                            style={{ flex: 1 }}
                        />
                    )}
                    onEndReached={() => {
                        if (visibleCount < filteredPokemons.length) {
                            setVisibleCount(previous =>
                                Math.min(
                                    previous + PAGE_SIZE,
                                    filteredPokemons.length
                                )
                            )
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        <ThemeText color="grayDark">
                            No Pokémon found.
                        </ThemeText>
                    }
                />
            </Card>
        </RootView>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    body: {
        flex: 1,
        marginTop: 8,
    },
    gridGap: {
        gap: 8,
    },
    list: {
        padding: 12,
    },
    search: {},
})