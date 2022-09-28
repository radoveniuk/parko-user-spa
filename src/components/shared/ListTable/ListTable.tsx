import React, { HTMLAttributes, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { ListTableCell, ListTableHeaderRow, ListTableWrapper } from './styles';

type Props = {
  columns: string[]
  children?: ReactNode;
  columnComponent?: (col: string) => ReactNode;
  stickyHeader?: boolean;
} & HTMLAttributes<HTMLDivElement>

const ListTable = ({ columns, children, columnComponent, stickyHeader, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <ListTableWrapper cols={columns.length} {...rest}>
      <ListTableHeaderRow sticky={stickyHeader}>
        {columns.map((column, index) => <ListTableCell key={column + index}>{columnComponent?.(column) || t(column)}</ListTableCell>)}
      </ListTableHeaderRow>
      {children}
    </ListTableWrapper>
  );
};

export default ListTable;
