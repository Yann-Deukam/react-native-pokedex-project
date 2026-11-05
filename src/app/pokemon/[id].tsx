import Card from '@/components/Card'
import PokemonSpecs from '@/components/pokemon/PokemonSpecs'
import PokemonStats from '@/components/pokemon/PokemonStats'
import PokemonType from '@/components/pokemon/PokemonType'
import RootView from '@/components/RootView'
import Row from '@/components/Row'
import ThemeText from '@/components/ThemeText'
import { router, useLocalSearchParams } from 'expo-router'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { Colors } from '../../../constants/color'
import { formatSize, formatWeight, getPokemonArtwork } from '../../../functions/pokemon'
import { useFetchQuery } from '../../../hooks/useFetchQuery'
import { useThemeColors } from '../../../hooks/useThemeColors'

export default function Pokemon () {
    const colors = useThemeColors()
    const params = useLocalSearchParams() as {id: string}
    const {data:pokemon} = useFetchQuery('/pokemon/[id]', {id:params.id})
    const {data:species} = useFetchQuery('/pokemon-species/[id]', {id:params.id})
    const mainType = pokemon?.types?.[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint
    const types = pokemon?.types ?? []
    const bio = species?.flavor_text_entries
    ?.find(({language}) => language.name === "en")
    ?.flavor_text.replaceAll("\n",". ")
  return (
    <RootView style={{ backgroundColor: colorType }}>
      <View>
        <Image source={require("@/assets/images/pokeball_bg.png")} style={styles.pokeball}/>
      <Row style={styles.header}>
        <Pressable onPress={()=>router.back()}>
          <Row gap={8}>
          <Image
            source={require("@/assets/images/left-chevron.png")}
            style={{ width: 28, height: 28 }}
          />
          <ThemeText color='white' variant='headline' style={{textTransform: "capitalize"}}>{pokemon?.name}</ThemeText>
        </Row>
        </Pressable>
        <ThemeText color='white' variant='subtitle2' >
          #{params.id.padStart(3,'0')}
        </ThemeText>
      </Row>
      <View style={styles.body}>
          <Image 
            style={styles.artwork}
            source={{uri: getPokemonArtwork(params.id)}}
            width={200} 
            height={200} 
          />
        <Card style={styles.card}>
          <Row gap={8}>
            {types.map(type => <PokemonType name={type.type.name} key={type.type.name}  />)}
          </Row>
          <ThemeText variant='subtitle1' style={{ color: colorType }}>About</ThemeText>
          <Row>
            <PokemonSpecs title={formatWeight(pokemon?.weight)} desc='weight' image={require("@/assets/images/weight.png")} />
            <PokemonSpecs title={formatSize(pokemon?.height)} desc='Height' image={require("@/assets/images/height.png")} />
            <PokemonSpecs title={pokemon?.moves.slice(0,2).map((m) => m.move.name).join("\n")} desc='Abilities'/>
          </Row>
          <ThemeText variant='subtitle1'>{bio} </ThemeText>
          <ThemeText variant='subtitle1' style={{ color: colorType }}>Base Stats</ThemeText>
          <View style={{alignSelf:"stretch"}}>
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
      </View>
    </RootView>
  )
}

const styles = StyleSheet.create({
  header:{
    marginHorizontal: 10,
    marginVertical:20,
    justifyContent: "space-between"
  },
  pokeball:{
    position:"absolute",
    right: 0,
    top:0,
    width: 208, 
    height: 208
  },
  artwork:{
    position: "absolute",
    top: -140,
    alignSelf: 'center',
    zIndex:2
  },
  body:{
    marginTop: 144,
  },
  card: {
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
    gap: 20,
    paddingBottom: 20
},
})