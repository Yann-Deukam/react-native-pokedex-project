import { useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

const Pokemon = () => {
    const params = useLocalSearchParams()
  return (
    <View>
      <Text>{params.id}</Text>
    </View>
  )
}

export default Pokemon