import { ReactNode } from 'react';

export type Column = {
  field: string;
  headerName: string;
  type?: 'string' | 'number' | 'boolean';
  valueGetter?: (value: any) => string | ReactNode;
}

export type Row = {
  _id: string;
  [key: string | number]: any;
}

export const ROWS_PER_PAGE_OPTIONS = [20, 50, 100, 200, 500, 1000];
