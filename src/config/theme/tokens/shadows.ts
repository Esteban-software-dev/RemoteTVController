import { component_colors } from '../colors/colors';

export const shadows = {
    soft: {
        shadowColor: component_colors.shadow,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    glass: {
        shadowColor: component_colors.shadow,
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
    },
} as const;