import React from 'react';
import { useParams } from 'react-router-dom';

import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import { DateTime } from 'luxon';
import { AcceptIcon, CloseIcon, QuestionIcon } from 'components/icons';
import { themeConfig } from 'theme';

const columns = [
  'prepayment.date',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.approved',
];

const getApprovedIcon = (value: boolean | null) => {
  if (value) {
    return <AcceptIcon color={themeConfig.palette.success.main} size={20}/>;
  }
  if (value === false) {
    return <CloseIcon color={themeConfig.palette.error.main} size={20} />;
  }
  return <QuestionIcon size={20} />;
};

const Prepayments = () => {
  const { id: userId } = useParams();
  const { data } = useGetPrepayments({ userId });

  return (
    <ListTable columns={columns} >
      {data?.map((item) => (
        <ListTableRow key={item._id}>
          <ListTableCell>{item.createdAt && DateTime.fromISO(item.createdAt).toFormat('dd.MM.yyyy')}</ListTableCell>
          <ListTableCell>{`${item.sum}€`}</ListTableCell>
          <ListTableCell>{item.userComment}</ListTableCell>
          <ListTableCell>{getApprovedIcon(item.isApproved)}</ListTableCell>
        </ListTableRow>
      ))}
    </ListTable>
  );
};

export default Prepayments;
