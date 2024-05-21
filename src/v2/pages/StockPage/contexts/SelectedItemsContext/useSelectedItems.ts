import { useContext } from 'react';

import { SelectedItemsContext } from './SelectedItemsContext';

export const useSelectedItems = () => {
  const context = useContext(SelectedItemsContext);
  if (!context) {
    throw new Error('SelectedItems context not connected');
  }
  return context;
};
