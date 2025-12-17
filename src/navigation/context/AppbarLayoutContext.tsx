import { createContext } from 'react';

export const AppBarLayoutContext = createContext({
    height: 0,
    setHeight: (_: number) => {},
});
