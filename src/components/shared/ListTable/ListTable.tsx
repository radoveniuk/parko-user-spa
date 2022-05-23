import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ListTableCell, ListTableHeaderRow, ListTableWrapper } from './styles';

type Props = {
  columns: string[]
  children?: ReactNode;
}

const ListTable = ({ columns, children }: Props) => {
  const { t } = useTranslation();

  return (
    <ListTableWrapper cols={columns.length}>
      <ListTableHeaderRow>
        {columns.map((column) => <ListTableCell key={column}>{t(column)}</ListTableCell>)}
      </ListTableHeaderRow>
      {children}
    </ListTableWrapper>
  );
};

export default ListTable;
