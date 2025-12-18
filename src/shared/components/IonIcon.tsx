import React from 'react'
import Ionicons, { IoniconsIconName } from '@react-native-vector-icons/ionicons'
import { colors } from '@src/config/theme/colors/colors';
import { TextStyle, StyleProp } from 'react-native';

export interface IonIconProps {
    name: IoniconsIconName;
    size?: number;
    color?: string;
    filled?: boolean;
    iconStyles?: StyleProp<TextStyle>
}
export function IonIcon({
    name,
    size = 12,
    color= colors.dark.base,
    filled = false,
    iconStyles = {}
}: IonIconProps) {
    return (
        <Ionicons name={name} size={size} color={color} style={iconStyles} />
    )
}