import Card from '@/components/Card'
import ThemeText from '@/components/ThemeText'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useThemeColors } from '../../hooks/useThemeColors'

export default function pokedex() {
    const colors = useThemeColors()
    const pokemons = Array.from({length: 30}, (_, i) => ({
        name: "pokemon name",
        id: i + 1
    }))
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
            renderItem={({item}) => <Card style={{flex:1/3, height:200}}>
            <Text>{item.name}</Text>
        </Card>}  
            keyExtractor={item => item.id.toString()} />
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