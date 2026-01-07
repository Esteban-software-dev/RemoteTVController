import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export function AppBackground() {
    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={styles.base} />
            <View
                style={{
                    ...StyleSheet.absoluteFill,
                    backgroundColor: 'rgba(255,255,255,0.015)',
                }}
            />

            <LinearGradient
                colors={[
                    'rgba(77,109,79,0.05)',
                    'transparent',
                    'rgba(0,0,0,0.15)',
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0E1116',
    },
});
