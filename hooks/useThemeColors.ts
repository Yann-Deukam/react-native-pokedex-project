import { useColorScheme } from "react-native";
import { Colors } from "../constants/color";

export function useThemeColors() {
    const theme = useColorScheme() ?? "light"
    return Colors[theme]       
}