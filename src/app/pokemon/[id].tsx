import RootView from '@/components/RootView'
import Row from '@/components/Row'
import ThemeText from '@/components/ThemeText'
import { router, useLocalSearchParams } from 'expo-router'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { Colors } from '../../../constants/color'
import { useFetchQuery } from '../../../hooks/useFetchQuery'
import { useThemeColors } from '../../../hooks/useThemeColors'

export default function Pokemon () {
    const colors = useThemeColors()
    const params = useLocalSearchParams() as {id: string}
    const {data:pokemon} = useFetchQuery('/pokemon/[id]', {id:params.id})
    const mainType = pokemon?.types?.[0].type.name;
    const colorType = mainType ? Colors.type[mainType] : colors.tint
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
          <ThemeText color='white' variant='headline'>{pokemon?.name}</ThemeText>
        </Row>
        </Pressable>
        <ThemeText color='white' variant='subtitle2'>
          #{params.id.padStart(3,'0')}
        </ThemeText>
      </Row>
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
  }
})