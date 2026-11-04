
import Card from '@/components/Card'
import PokemonCard from '@/components/pokemon/PokemonCard'
import Row from '@/components/Row'
import SearchBar from '@/components/SearchBar'
import ThemeText from '@/components/ThemeText'
import { useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getPokemonIdFromUrl } from '../../functions/pokemon'
import { useFetchQuery } from '../../hooks/useFetchQuery'
import { useThemeColors } from '../../hooks/useThemeColors'

const PAGE_SIZE = 21

export default function pokedex() {
    const colors = useThemeColors()

    // Fetch the complete Pokémon directory
    const { data, isLoading, isError } = useFetchQuery(
        "/pokemon?limit=2000&offset=0"
    )

    const [search, setSearch] = useState("")
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    // Filter Pokémon by name or ID
    const filteredPokemons = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()
        const pokemons = data?.results ?? []

        if (!normalizedSearch) return pokemons

        return pokemons.filter(pokemon => {
            const id = getPokemonIdFromUrl(pokemon.url).toString()

            return (
                pokemon.name.toLowerCase().includes(normalizedSearch) ||
                id === normalizedSearch
            )
        })
    }, [data, search])

    // Display results in batches of 21
    const displayedPokemons = filteredPokemons.slice(0, visibleCount)

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
                <ActivityIndicator size="large" color={colors.grayLight} />
            </SafeAreaView>
        )
    }

    if (isError) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
                <ThemeText color="grayLight">
                    Failed to load Pokémon.
                </ThemeText>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
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
            </Row>

            <Card style={styles.body}>
                <FlatList
                    data={displayedPokemons}
                    numColumns={3}
                    contentContainerStyle={[styles.gridGap, styles.list]}
                    columnWrapperStyle={styles.gridGap}
                    keyExtractor={item => item.url}
                    renderItem={({ item }) => (
                        <PokemonCard
                            id={getPokemonIdFromUrl(item.url)}
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
    },
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
