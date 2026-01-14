import { colors } from "@src/config/theme/colors/colors";
import { StyleSheet, Text, View } from "react-native";

interface FallbackIconProps {
    name: string;
}
export function FallbackIcon({
    name
}: FallbackIconProps) {
    return (
        <View style={fallbackStyles.fallback}>
            <Text style={fallbackStyles.letter}>
                {name.charAt(0).toUpperCase()}
            </Text>
        </View>
    )
}

const fallbackStyles = StyleSheet.create({
    fallback: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.white.base,
    }
});