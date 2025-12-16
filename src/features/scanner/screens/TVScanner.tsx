import { globalStyles } from "@src/config/theme/styles/global.styles";
import { StyleSheet, Text, View } from "react-native";


export function TVScanner() {
    return (
        <View style={[globalStyles.container, styles.container]}>
            <Text>
                Hola
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1
    }
});