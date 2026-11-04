import { StyleSheet, View } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";

type RadioProps = {
    checked: boolean
}

export function Radio({checked}: RadioProps){
    const colors = useThemeColors();

    return(
        <View style={[styles.radio, {borderColor: colors.tint}]}>
            {checked && <View style={[styles.radioInner, {backgroundColor: colors.tint}]}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    radio: {
        width: 14,
        height: 14,
        borderStyle:"solid",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius:14
    },
    radioInner: {
        borderRadius: 6,
        width: 6,
        height: 6
    }
})