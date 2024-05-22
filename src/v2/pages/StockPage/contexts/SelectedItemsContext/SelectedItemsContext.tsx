import React, { createContext, PropsWithChildren } from 'react';

import useListState, { UseListStateType } from 'hooks/useListState';

type ContextType<T> = UseListStateType<T>;

export const SelectedItemsContext = createContext<ContextType<any> | undefined>(undefined);

export function SelectedItemsProvider<T> (props: PropsWithChildren) {
  const state = useListState<T>([]);

  return (
    <SelectedItemsContext.Provider value={state}>
      {props.children}
    </SelectedItemsContext.Provider>
  );
};
