import React, { HTMLAttributes, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { ListTableCell, ListTableHeaderRow, ListTableWrapper } from './styles';

type Props = {
  columns: string[]
  children?: ReactNode;
  columnComponent?: (col: string, index: number) => ReactNode;
  stickyHeader?: boolean;
  renderIf?: boolean;
  maxHeight?: string | number;
} & HTMLAttributes<HTMLDivElement>

const ListTable = ({ columns, children, columnComponent, stickyHeader, renderIf = true, maxHeight, ...rest }: Props) => {
  const { t } = useTranslation();
  if (!renderIf) return null;
  return (
    <ListTableWrapper cols={columns.length} maxHeight={maxHeight} {...rest}>
      <ListTableHeaderRow sticky={stickyHeader}>
        {columns.map((column, index) => (
          <ListTableCell
            key={column + index}
          >
            {columnComponent?.(column, index) || t(column)}
          </ListTableCell>
        ))}
      </ListTableHeaderRow>
      {children}
    </ListTableWrapper>
  );
};

export default ListTable;
