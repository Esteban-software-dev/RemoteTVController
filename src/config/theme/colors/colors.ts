export const colors = {
    dark: {
        background: '#0B0D12',
        surface: '#131621',
        surface2: '#1A1E2C',
        border: 'rgba(255,255,255,0.06)',
        base: '#1D1D1D', // legacy
    },

    bone: {
        base: '#FAFAFA',
        soft: '#F3F4F6',
    },

    white: {
        base: '#FFFFFF',
    },

    text: {
        primary: '#FFFFFF',
        secondary: 'rgba(255,255,255,0.65)',
        muted: 'rgba(255,255,255,0.4)',
        disabled: 'rgba(255,255,255,0.25)',
        inverted: '#0B0D12',
    },

    accent: {
        purple: {
            soft: 'rgba(139,92,246,0.15)',
            base: '#8B5CF6',
            strong: '#7C3AED',
            dark: '#5B21B6',
        },
        teal: {
            soft: 'rgba(45,212,191,0.15)',
            base: '#2DD4BF',
            strong: '#14B8A6',
        },
        pink: {
            soft: 'rgba(244,114,182,0.15)',
            base: '#F472B6',
        },
        gray: {
            soft: 'rgba(229,231,235,0.08)',
            base: '#E5E7EB',
            icon: '#9CA3AF',
            text: '#6B7280',
        },
    },

    gradient: {
        1: '#38298B',
        2: '#9E36CE',
        3: '#F2334C',
        glow: ['#8B5CF6', '#2DD4BF'],
    },

    state: {
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#38BDF8',
    },

    green: {
        base: '#4D6D4F',
        soft: 'rgba(77,109,79,0.2)',
    },
} as const;

export const component_colors = {
    shadow: '#000',
    card: colors.dark.surface,
    cardRaised: colors.dark.surface2,
    divider: colors.dark.border,
    focus: colors.accent.purple.base,
    focusSoft: colors.accent.purple.soft,
    selection: colors.accent.teal.soft,
} as const;