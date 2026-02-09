import React, { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Toast, ToastActionButton, ToastAlign, ToastPosition, ToastType } from '@src/shared/components/Toast';
import { useTranslation } from 'react-i18next';

export type ToastOptions = {
    title?: string;
    subtitle?: string;
    iconName?: ToastIconName;
    type?: ToastType;
    align?: ToastAlign;
    position?: ToastPosition;
    duration?: number;
    renderContent?: ReactNode;
    actionButton?: ToastActionButton | ToastActionButton[];
    showCloseButton?: boolean;
    closeLabel?: string;
};

type ToastState = ToastOptions & {
    id: string;
    visible: boolean;
    remaining: number;
    running: boolean;
    startedAt?: number;
};

export type ToastIconName = import('@react-native-vector-icons/ionicons').IoniconsIconName;

type ToastApi = {
    show: (params: ToastOptions) => void;
    hide: () => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ToastState[]>([]);
    const timeoutsRef = useRef<Record<string, any>>({});
    const MAX_VISIBLE = 5;

    const clearTimer = (id: string) => {
        const t = timeoutsRef.current[id];
        if (t) {
            clearTimeout(t);
            delete timeoutsRef.current[id];
        }
    };

    const clearAllTimers = () => {
        Object.keys(timeoutsRef.current).forEach((id) => clearTimer(id));
    };

    const computeRemaining = (toast: ToastState) => {
        if (!toast.running || !toast.startedAt) return toast.remaining;
        const elapsed = Date.now() - toast.startedAt;
        return Math.max(0, toast.remaining - elapsed);
    };

    const getGroupKey = (toast: ToastOptions) => {
        const align = toast.align ?? 'bottom';
        if (align !== 'custom') return align;
        const top = toast.position?.top ?? 'x';
        const bottom = toast.position?.bottom ?? 'x';
        return `custom:${top}:${bottom}`;
    };

    const getTopByGroup = (list: ToastState[]) => {
        const groups = new Map<string, ToastState>();
        list.forEach((t) => {
            const key = getGroupKey(t);
            const current = groups.get(key);
            if (!current || current.id === t.id || list.indexOf(t) > list.indexOf(current)) {
                groups.set(key, t);
            }
        });
        return groups;
    };

    const closeToast = (id: string) => {
        clearTimer(id);
        setState((prev) => prev.map((t) => (
            t.id === id ? { ...t, visible: false, running: false } : t
        )));
        setTimeout(() => {
            setState((prev) => {
                const next = prev.filter((t) => t.id !== id);
                if (!next.length) return next;
                const closed = prev.find((t) => t.id === id);
                if (!closed) return next;
                const groupKey = getGroupKey(closed);
                const groupItems = next.filter((t) => getGroupKey(t) === groupKey);
                const top = groupItems[groupItems.length - 1];
                if (top && top.visible && !top.running && top.remaining > 0) {
                    return next.map((t) => (
                        t.id === top.id ? { ...t, running: true, startedAt: Date.now() } : t
                    ));
                }
                return next;
            });
        }, 220);
    };

    const pauseToast = (id: string) => {
        setState((prev) => prev.map((t) => (
            t.id === id
                ? { ...t, remaining: computeRemaining(t), running: false, startedAt: undefined }
                : t
        )));
    };

    const resumeToast = (id: string) => {
        setState((prev) => prev.map((t) => (
            t.id === id && t.visible && !t.running && t.remaining > 0
                ? { ...t, running: true, startedAt: Date.now() }
                : t
        )));
    };
    const { t } = useTranslation();

    const api = useMemo<ToastApi>(() => ({
        show: (params) => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            setState((prev) => {
                const next = [...prev];
                const duration = params.duration ?? 3500;
                const remaining = duration > 0 ? duration : 0;
                const groupKey = getGroupKey(params);
                const groupItems = next.filter((t) => getGroupKey(t) === groupKey);
                const top = groupItems[groupItems.length - 1];
                if (top) {
                    const updated = {
                        ...top,
                        remaining: computeRemaining(top),
                        running: false,
                        startedAt: undefined,
                    };
                    return [
                        ...next.map((t) => (t.id === top.id ? updated : t)),
                        {
                            id,
                            visible: true,
                            remaining,
                            running: remaining > 0,
                            startedAt: remaining > 0 ? Date.now() : undefined,
                            ...params,
                        },
                    ];
                }
                next.push({
                    id,
                    visible: true,
                    remaining,
                    running: remaining > 0,
                    startedAt: remaining > 0 ? Date.now() : undefined,
                    ...params,
                });
                return next;
            });
        },
        hide: () => {
            setState((prev) => {
                if (!prev.length) return prev;
                const top = prev[prev.length - 1];
                return prev.map((t) => (
                    t.id === top.id ? { ...t, visible: false, running: false } : t
                ));
            });
        },
    }), []);

    useEffect(() => {
        clearAllTimers();
        const tops = getTopByGroup(state);
        tops.forEach((top) => {
            if (!top.visible || !top.running) return;
            if (top.remaining <= 0) {
                closeToast(top.id);
                return;
            }
            timeoutsRef.current[top.id] = setTimeout(() => closeToast(top.id), top.remaining);
        });
        return () => clearAllTimers();
    }, [state]);

    return (
        <ToastContext.Provider value={api}>
            {children}
            {(() => {
                const visibleItems = state;
                const grouped = new Map<string, ToastState[]>();
                visibleItems.forEach((t) => {
                    const key = getGroupKey(t);
                    if (!grouped.has(key)) grouped.set(key, []);
                    grouped.get(key)!.push(t);
                });

                const rendered: React.ReactNode[] = [];
                grouped.forEach((group) => {
                    const slice = group.slice(-MAX_VISIBLE);
                    slice.forEach((toast, index, arr) => {
                        const stackIndex = arr.length - 1 - index;
                        const align = toast.align ?? 'bottom';
                        const direction = align === 'top' ? 1 : -1;
                        const stackOffset = stackIndex * 12 * direction;
                        const stackScale = 1 - stackIndex * 0.03;

                        rendered.push(
                            <Toast
                                key={toast.id}
                                visible={toast.visible}
                                title={toast.title}
                                subtitle={toast.subtitle}
                                iconName={toast.iconName}
                                type={toast.type}
                                align={toast.align}
                                position={toast.position}
                                renderContent={toast.renderContent}
                                actionButton={toast.actionButton}
                                showCloseButton={toast.showCloseButton}
                                closeLabel={toast.closeLabel ?? t('components.toast.closeButton')}
                                stackOffset={stackOffset}
                                stackScale={stackScale}
                                onClose={() => closeToast(toast.id)}
                                onHoldStart={() => pauseToast(toast.id)}
                                onHoldEnd={() => resumeToast(toast.id)}
                            />
                        );
                    });
                });

                return rendered;
            })()}
        </ToastContext.Provider>
    );
}
