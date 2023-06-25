import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useUpdatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { useGetPrepayments } from 'api/query/prepaymentQuery';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IPrepayment, PrepaymentStatus } from 'interfaces/prepayment.interface';

import { EmptyDataWrapper } from '../styles';

import { ApproveDialogWrapper } from './styles';

const COLS = [
  'prepayment.date',
  'prepayment.sum',
  'prepayment.comment',
  'prepayment.status',
  'prepayment.paymentDate',
];

const Prepayments = () => {
  const { id: user } = useParams();
  const { t } = useTranslation();
  const { data, refetch } = useGetPrepayments({ user });
  const updatePrepaymentMutation = useUpdatePrepaymentMutation();

  const [selectedItem, setSelectedItem] = useState<IPrepayment>();

  const updatePrepaymentHandler = (status: PrepaymentStatus) => {
    if (selectedItem) {
      updatePrepaymentMutation.mutateAsync({ ...selectedItem, status }).then(() => { setSelectedItem(undefined); refetch(); });
    }
  };

  if (!data?.length) {
    return (
      <EmptyDataWrapper>
        {t('noData')}
      </EmptyDataWrapper>
    );
  };

  return (
    <>
      <ListTable columns={COLS} >
        {data?.map((item) => (
          <ListTableRow key={item._id} onClick={() => void setSelectedItem(item)}>
            <ListTableCell>{getDateFromIso(item.createdAt)}</ListTableCell>
            <ListTableCell>{`${item.sum}€`}</ListTableCell>
            <ListTableCell>{item.userComment}</ListTableCell>
            <ListTableCell>{t(`selects.prepaymentStatus.${item.status}`)}</ListTableCell>
            <ListTableCell>{getDateFromIso(item.paymentDate)}</ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
      {!!selectedItem && (
        <Dialog title={t('prepayment.approval')} open={!!selectedItem} onClose={() => void setSelectedItem(undefined)}>
          <ApproveDialogWrapper>
            <strong>
              {typeof selectedItem.user !== 'string' && `${selectedItem.user.name} ${selectedItem.user.surname}`}
            </strong>
            <p>{selectedItem.createdAt && getDateFromIso(selectedItem.createdAt)}</p>
            <p>{`${selectedItem.sum}€`}</p>
            <i>{selectedItem.userComment}</i>
            <div className="actions">
              <Button color="success" onClick={() => void updatePrepaymentHandler('approved')}>{t('prepayment.approve')}</Button>
              <Button color="error" onClick={() => void updatePrepaymentHandler('rejected')}>{t('prepayment.reject')}</Button>
            </div>
          </ApproveDialogWrapper>
        </Dialog>
      )}
    </>
  );
};

export default Prepayments;
