import React, { createContext, PropsWithChildren, useContext } from 'react';

import useListState, { UseListStateType } from 'hooks/useListState';

type ContextType<T> = UseListStateType<T>;

export const TableSelectedItemsContext = createContext<ContextType<any> | undefined>(undefined);

export function TableSelectedItemsProvider<T> (props: PropsWithChildren) {
  const state = useListState<T>([]);

  return (
    <TableSelectedItemsContext.Provider value={state}>
      {props.children}
    </TableSelectedItemsContext.Provider>
  );
};

export const useTableSelectedItems = () => {
  const context = useContext(TableSelectedItemsContext);
  if (!context) {
    throw new Error('TableSelectedItems context not connected');
  }
  return context;
};
