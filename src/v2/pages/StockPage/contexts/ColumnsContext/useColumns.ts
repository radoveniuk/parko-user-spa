import { useContext } from 'react';

import { ColumnsContext } from './ColumnsContext';

export const useColumns = () => {
  const context = useContext(ColumnsContext);
  if (!context) {
    throw new Error('Columns context not connected');
  }
  return context;
};
