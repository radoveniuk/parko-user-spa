import React, { createContext, PropsWithChildren, useContext, useEffect } from 'react';

import useListState, { UseListStateType } from 'hooks/useListState';
import useLocalStorageState from 'hooks/useLocalStorageState';

type ContextType = UseListStateType<string>;

type ContextProps = {
  defaultValue: string[];
  localStorageKey: string;
};

export const TableColumnsContext = createContext<ContextType | undefined>(undefined);

export const TableColumnsProvider = (props: PropsWithChildren<ContextProps>) => {
  const [storedColsSettings, setStoredColsSettings] = useLocalStorageState(props.localStorageKey);
  const state = useListState<string>(storedColsSettings ? JSON.parse(storedColsSettings).cols : props.defaultValue);

  useEffect(() => {
    setStoredColsSettings(JSON.stringify({ cols: state[0] }));
  }, [setStoredColsSettings, state]);

  return (
    <TableColumnsContext.Provider value={state}>
      {props.children}
    </TableColumnsContext.Provider>
  );
};

export const useTableColumns = () => {
  const context = useContext(TableColumnsContext);
  if (!context) {
    throw new Error('TableColumns context not connected');
  }
  return context;
};
