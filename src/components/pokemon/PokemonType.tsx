import { View, ViewStyle } from "react-native";
import { Colors } from "../../../constants/color";
import ThemeText from "../ThemeText";


type PokemonTypes = {
    name: keyof (typeof Colors["type"]);
}

export default function PokemonType({ name }: PokemonTypes) {
  return (
    <View style={[rootStyle, {backgroundColor: Colors.type[name]}]}>
      <ThemeText color="white" variant="subtitle3" style={{textTransform: "capitalize"}}>
        {name}
      </ThemeText>
    </View>
  )
}

const rootStyle = {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 64,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 6,
} satisfies ViewStyle