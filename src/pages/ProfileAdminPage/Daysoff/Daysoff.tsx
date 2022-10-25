import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useUpdateDayoffMutation } from 'api/mutations/dayoffMutation';
import { useGetDaysoff } from 'api/query/dayoffQuery';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import Input from 'components/shared/Input';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IDayOff } from 'interfaces/dayoff.interface';

import { CommentDialogWrapper } from './styles';

const columns = [
  'dayoff.dateStart',
  'dayoff.dateEnd',
  'dayoff.reason',
  'dayoff.comment',
  'dayoff.adminComment',
];

const Daysoff = () => {
  const { id: user } = useParams();
  const { t } = useTranslation();
  const { data, refetch } = useGetDaysoff({ user });
  const updateDayoffMutation = useUpdateDayoffMutation();
  const [selectedItem, setSelectedItem] = useState<IDayOff>();
  const [adminComment, setAdminComment] = useState('');

  const saveAdminComment = () => {
    updateDayoffMutation.mutateAsync({ ...selectedItem, adminComment }).then(() => {
      setSelectedItem(undefined);
      refetch();
    });
  };

  return (
    <ListTable columns={columns} >
      {data?.map((item) => (
        <ListTableRow key={item._id} onClick={() => void setSelectedItem(item)}>
          <ListTableCell>{getDateFromIso(item.dateStart)}</ListTableCell>
          <ListTableCell>{getDateFromIso(item.dateEnd)}</ListTableCell>
          <ListTableCell>{t(`selects.dayoffReason.${item.reason}`)}</ListTableCell>
          <ListTableCell>{item.description}</ListTableCell>
          <ListTableCell>{item.adminComment}</ListTableCell>
        </ListTableRow>
      ))}
      {!!selectedItem && (
        <Dialog title={t('dayoff.adminComment')} open onClose={() => void setSelectedItem(undefined)}>
          <CommentDialogWrapper>
            <strong>
              {typeof selectedItem.user !== 'string' && `${selectedItem.user.name} ${selectedItem.user.surname}`}
            </strong>
            <div className="dates">
              <p>{getDateFromIso(selectedItem.dateStart)}</p>
              &ndash;
              <p>{getDateFromIso(selectedItem.dateEnd)}</p>
            </div>
            <p>{t(`selects.dayoffReason.${selectedItem.reason}`)}</p>
            <p>{selectedItem.description}</p>
            <Input
              defaultValue={selectedItem.adminComment}
              onChange={({ target: { value } }) => void setAdminComment(value) }
              autoFocus
              multiline
            />
            <Button onClick={saveAdminComment}>{t('dayoff.send')}</Button>
          </CommentDialogWrapper>
        </Dialog>
      )}
    </ListTable>
  );
};

export default Daysoff;
