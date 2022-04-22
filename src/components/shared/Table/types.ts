import { ReactNode } from 'react';

export type Column = {
  field: string;
  headerName: string;
  type?: 'string' | 'number' | 'boolean';
  valueGetter?: (value: any) => string | ReactNode;
}

export type Row = {
  id: string;
  [key: string | number]: any;
}
