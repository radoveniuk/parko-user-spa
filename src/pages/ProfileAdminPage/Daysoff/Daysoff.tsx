import React from 'react';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useGetDaysoff } from 'api/query/dayoffQuery';
import { useTranslation } from 'react-i18next';

const columns = [
  'dayoff.dateStart',
  'dayoff.dateEnd',
  'dayoff.reason',
  'dayoff.comment',
  'dayoff.adminComment',
];

const Daysoff = () => {
  const { id: userId } = useParams();
  const { t } = useTranslation();
  const { data } = useGetDaysoff({ userId });

  return (
    <ListTable columns={columns} >
      {data?.map((item) => (
        <ListTableRow key={item._id}>
          <ListTableCell>{DateTime.fromISO(item.dateStart).toFormat('dd.MM.yyyy')}</ListTableCell>
          <ListTableCell>{DateTime.fromISO(item.dateEnd).toFormat('dd.MM.yyyy')}</ListTableCell>
          <ListTableCell>{t(`dayoff.${item.reason}`)}</ListTableCell>
          <ListTableCell>{item.description}</ListTableCell>
          <ListTableCell>{item.adminComment}</ListTableCell>
        </ListTableRow>
      ))}
    </ListTable>
  );
};

export default Daysoff;
