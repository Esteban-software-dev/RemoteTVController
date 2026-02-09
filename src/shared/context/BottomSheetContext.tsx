import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { BottomSheet } from '@src/shared/components/BottomSheet';

export type BottomSheetOptions = {
    title?: string;
    subtitle?: string;
    height?: number;
    snapPoints?: number[];
    initialSnapIndex?: number;
    enablePanToClose?: boolean;
    enableBackdropDismiss?: boolean;
    closeThreshold?: number;
};

type BottomSheetState = BottomSheetOptions & {
    visible: boolean;
    content: ReactNode;
};

type BottomSheetApi = {
    open: (params: BottomSheetOptions & { content: ReactNode }) => void;
    close: () => void;
};

const BottomSheetContext = createContext<BottomSheetApi | null>(null);

export function useBottomSheet() {
    const ctx = useContext(BottomSheetContext);
    if (!ctx) {
        throw new Error('useBottomSheet must be used within BottomSheetProvider');
    }
    return ctx;
}

export function BottomSheetProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<BottomSheetState | null>(null);

    const api = useMemo<BottomSheetApi>(() => ({
        open: (params) => {
            setState({
                visible: true,
                ...params,
            });
        },
        close: () => {
            setState((prev) => (prev ? { ...prev, visible: false } : prev));
        },
    }), []);

    return (
        <BottomSheetContext.Provider value={api}>
            {children}
            {state && (
                <BottomSheet
                    visible={state.visible}
                    onClose={api.close}
                    title={state.title}
                    subtitle={state.subtitle}
                    height={state.height}
                    snapPoints={state.snapPoints}
                    initialSnapIndex={state.initialSnapIndex}
                    enablePanToClose={state.enablePanToClose}
                    enableBackdropDismiss={state.enableBackdropDismiss}
                    closeThreshold={state.closeThreshold}
                >
                    {state.content}
                </BottomSheet>
            )}
        </BottomSheetContext.Provider>
    );
}
