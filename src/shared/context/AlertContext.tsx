import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { AlertDialog, AlertButton, AlertPreset } from '@src/shared/components/AlertDialog';
import { useTranslation } from 'react-i18next';

export type AlertOptions = {
    title?: string;
    message?: string;
    content?: ReactNode;
    iconName?: import('@react-native-vector-icons/ionicons').IoniconsIconName;
    iconColor?: string;
    preset?: AlertPreset;
    buttons?: AlertButton[];
    backdropDismiss?: boolean;
    onDidDismiss?: () => void;
};

type AlertState = AlertOptions & {
    visible: boolean;
};

type AlertApi = {
    show: (options: AlertOptions) => void;
    hide: () => void;
};

const AlertContext = createContext<AlertApi | null>(null);

export function useAlert() {
    const ctx = useContext(AlertContext);
    if (!ctx) {
        throw new Error('useAlert must be used within AlertProvider');
    }
    return ctx;
}

export function AlertProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AlertState | null>(null);
    const { t } = useTranslation();

    const api = useMemo<AlertApi>(() => ({
        show: (options) => {
            setState({
                visible: true,
                ...options,
            });
        },
        hide: () => {
            setState((prev) => (prev ? { ...prev, visible: false } : prev));
        },
    }), []);

    const buttons: AlertButton[] = state?.buttons?.length
        ? state.buttons
        : [
            { label: t('components.alert.cancel'), role: 'cancel' },
            { label: t('components.alert.ok'), role: 'default' },
        ];

    return (
        <AlertContext.Provider value={api}>
            {children}
            {state && (
                <AlertDialog
                    visible={state.visible}
                    title={state.title}
                    message={state.message}
                    content={state.content}
                    iconName={state.iconName}
                    iconColor={state.iconColor}
                    preset={state.preset}
                    buttons={buttons}
                    backdropDismiss={state.backdropDismiss}
                    onDidDismiss={state.onDidDismiss}
                    onClose={api.hide}
                />
            )}
        </AlertContext.Provider>
    );
}
