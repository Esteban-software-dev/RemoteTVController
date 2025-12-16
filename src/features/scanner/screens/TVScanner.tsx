import { globalStyles } from "@src/config/theme/styles/global.styles";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export function TVScanner() {

    return (
        <ScrollView style={[globalStyles.container]}>
            {
                [1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40].map((v, i) => {
                    return (
                    <View id={v.toString()} key={v+10}>
                        <Text>
                            {i+1}° Hola: {v}
                        </Text>
                    </View>
                    )
                })
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    
});