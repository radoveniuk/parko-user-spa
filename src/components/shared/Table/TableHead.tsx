import React from 'react';
import { TableCell, TableHead as TableHeadMaterial, TableRow } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Column } from './types';

type TableHeadProps = {
  columns: Column[];
}

export default function TableHead ({ columns }: TableHeadProps) {
  const { t } = useTranslation();

  return (
    <TableHeadMaterial>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.field}
            align="center"
            padding="normal"
          >
            {t(headCell.headerName)}
          </TableCell>
        ))}
      </TableRow>
    </TableHeadMaterial>
  );
}
