import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { useDeletePrepaymentMutation, useUpdatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { DeleteIcon, EditIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import PrepaymentDialog from '../PrepaymentDialog';

import { usePrepaymentRowContext } from './context';
import { LinkWrapper } from './styles';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { useFilters } from 'components/shared/Filters';

const InfoRow = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data } = usePrepaymentRowContext();

  const user = data.user as IUser;
  const project = user.project as IProject;
  const client = project?.client as IClient;

  const { debouncedFiltersState } = useFilters();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const updatePrepaymentMutation = useUpdatePrepaymentMutation();
  const deletePrepaymentMutation = useDeletePrepaymentMutation();
  const queryKey = ['prepayments', JSON.stringify(debouncedFiltersState)];

  const updatePrepaymentHandler = (values: Partial<IPrepayment>) => {
    setOpenDialog(false);
    const oldItems = queryClient.getQueryData(queryKey) as IPrepayment[];
    const users: IUser[] = queryClient.getQueryData(['users-filter', JSON.stringify({})]) || [];
    const valuesUser = users.find((user) => user._id === values.user);
  
    queryClient.setQueryData(queryKey, oldItems.map((item) => item._id === data._id ? { ...data, ...values, user: valuesUser?._id !== user._id ? valuesUser : user } : item));
    updatePrepaymentMutation.mutate({ ...values, _id: data._id });
  };

  const removePrepaymentHandler = () => {
    deletePrepaymentMutation.mutate(data._id);
    const oldItems = queryClient.getQueryData(queryKey) as IPrepayment[];
    queryClient.setQueryData(queryKey, oldItems.filter((item) => item._id !== data._id));
  };

  return (
    <ListTableRow>
      <ListTableCell>
        <LinkWrapper>
          <Link to={`/profile/${user._id}`} className="table-link">
            {user.name} {user.surname}
          </Link>
        </LinkWrapper>
      </ListTableCell>
      <ListTableCell>
        {client ? `${client.name} > ` : ''}{project?.name}
      </ListTableCell>
      <ListTableCell>
        <StatusLabel className={user.status}>{t(`selects.userStatus.${user.status}`)}</StatusLabel>
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.period || data.createdAt, 'MM/yyyy')}
      </ListTableCell>
      <ListTableCell>
        {Number(data.sum).toFixed(2)} €
      </ListTableCell>
      <ListTableCell>
        {data.userComment}
      </ListTableCell>
      <ListTableCell>
        <StatusLabel className={data.status}>{t(`selects.prepaymentStatus.${data.status}`)}</StatusLabel>
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.createdAt)}
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.paymentDate)}
      </ListTableCell>
      <ListTableCell>
        <IconButton onClick={() => void setOpenDialog(true)}><EditIcon /></IconButton>
      </ListTableCell>
      <ListTableCell>
        <IconButton onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
      </ListTableCell>
      {!!openDialog && (
        <PrepaymentDialog
          open={openDialog}
          onClose={() => void setOpenDialog(false)}
          onSave={updatePrepaymentHandler}
          data={data}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          open={openDeleteDialog}
          onSubmit={() => {
            setOpenDeleteDialog(false);
            removePrepaymentHandler();
          }}
          onClose={() => void setOpenDeleteDialog(false)}
        />
      )}
    </ListTableRow>
  );
};

export default InfoRow;
