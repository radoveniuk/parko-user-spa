import React, { HTMLAttributes, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ListTableCell, ListTableHeaderRow, ListTableWrapper } from './styles';

type Props = {
  columns: string[]
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>

const ListTable = ({ columns, children, ...rest }: Props) => {
  const { t } = useTranslation();
  return (
    <ListTableWrapper cols={columns.length} {...rest}>
      <ListTableHeaderRow>
        {columns.map((column, index) => <ListTableCell key={column + index}>{t(column)}</ListTableCell>)}
      </ListTableHeaderRow>
      {children}
    </ListTableWrapper>
  );
};

export default ListTable;
