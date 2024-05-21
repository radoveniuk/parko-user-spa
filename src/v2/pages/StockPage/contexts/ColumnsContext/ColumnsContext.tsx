import React, { createContext, PropsWithChildren, useEffect } from 'react';

import useListState, { UseListStateType } from 'hooks/useListState';
import useLocalStorageState from 'hooks/useLocalStorageState';

type ContextType = UseListStateType<string>;

type ContextProps = {
  defaultValue: string[];
  localStorageKey: string;
};

export const ColumnsContext = createContext<ContextType | undefined>(undefined);

export const ColumnsProvider = (props: PropsWithChildren<ContextProps>) => {
  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState(props.localStorageKey);
  const state = useListState<string>(storedColsSettings ? JSON.parse(storedColsSettings).cols : props.defaultValue);

  useEffect(() => {
    setStoredColsSettings(JSON.stringify({ cols: state[0] }));
  }, [setStoredColsSettings, state]);

  return (
    <ColumnsContext.Provider value={state}>
      {props.children}
    </ColumnsContext.Provider>
  );
};
