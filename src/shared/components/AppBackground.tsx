import { StyleSheet, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export function AppBackground() {
    return (
        <Image
            source={require('@src/assets/backgrounds/background-image.png')}
            style={[styles.image]}
            resizeMode="cover"
            blurRadius={10}
        />
    );
}

const styles = StyleSheet.create({
    image: {
        position: 'absolute',
        width,
        height,
        top: 0,
        left: 0,
    },
});
