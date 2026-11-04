import Card from '@/components/Card'
import PokemonCard from '@/components/pokemon/PokemonCard'
import ThemeText from '@/components/ThemeText'
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getPokemonIdFromUrl } from '../../functions/pokemon'
import { useInfiniteFetchQuery } from '../../hooks/useFetchQuery'
import { useThemeColors } from '../../hooks/useThemeColors'

export default function pokedex() {
    const colors = useThemeColors()
    const {data, isFetching, fetchNextPage}  = useInfiniteFetchQuery("/pokemon?limit=21")
    const pokemons = data?.pages.flatMap(page => page.results) ?? []
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/pokeball.png')} width={24} height={24} />
        <ThemeText variant="headline"color="grayLight">Pokedex</ThemeText>
      </View>
      <Card style={styles.body}> 
        <FlatList 
            data={pokemons} 
            numColumns={3}
            contentContainerStyle={[styles.gridGap, styles.list]}
            columnWrapperStyle={styles.gridGap}
            ListFooterComponent={
                isFetching ? 
                    <ActivityIndicator size="large" color={colors.tint} style={{marginVertical: 12}} /> : undefined
            }
            onEndReached={() => fetchNextPage()}
            renderItem={({item}) => <PokemonCard id={getPokemonIdFromUrl(item.url)} name={item.name} style={{flex:1/3}} />}  
            keyExtractor={(item) => item.url} />
      </Card>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:4
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap:16,
        padding: 12,
    },
    body: {
        flex:1,
    },
    gridGap: {
        gap: 8,
    },
    list: {
        padding: 12,
    }
})