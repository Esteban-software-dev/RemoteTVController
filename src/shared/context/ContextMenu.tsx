import { createContext, useContext, useState } from 'react';
import { ContextMenuAction, ContextMenuComponent } from '../components/ContextMenuComponent';

type OpenParams<T> = {
  payload: T;
  renderTarget: (payload: T) => React.ReactNode;
  actions: ContextMenuAction<T>[];
};

const ContextMenuContext = createContext<any>(null);

export function useContextMenu<T>() {
  return useContext(ContextMenuContext) as {
    open: (params: OpenParams<T>) => void;
    close: () => void;
  };
}

export function ContextMenuProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OpenParams<any> | null>(null);

  return (
    <ContextMenuContext.Provider
    value={{
      open: setState,
      close: () => setState(null),
    }}>
      {children}
      {state && (
        <ContextMenuComponent
          {...state}
          onClose={() => setState(null)}
        />
      )}
    </ContextMenuContext.Provider>
  );
}
