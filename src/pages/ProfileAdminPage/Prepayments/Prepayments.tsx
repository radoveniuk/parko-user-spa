import React from 'react';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import { ApprovedIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useGetPrepayments } from 'api/query/prepaymentQuery';

const columns = [
  'prepayment.date',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.approved',
];

const Prepayments = () => {
  const { id: user } = useParams();
  const { data } = useGetPrepayments({ user });

  return (
    <ListTable columns={columns} >
      {data?.map((item) => (
        <ListTableRow key={item._id}>
          <ListTableCell>{item.createdAt && DateTime.fromISO(item.createdAt).toFormat('dd.MM.yyyy')}</ListTableCell>
          <ListTableCell>{`${item.sum}€`}</ListTableCell>
          <ListTableCell>{item.userComment}</ListTableCell>
          <ListTableCell><ApprovedIcon approved={item.isApproved} size={20} /></ListTableCell>
        </ListTableRow>
      ))}
    </ListTable>
  );
};

export default Prepayments;
