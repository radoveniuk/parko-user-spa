import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EditIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import usePrepaymentMutations from '../../hooks/usePrepaymentMutations';
import PrepaymentDialog from '../PrepaymentDialog';

import { LinkWrapper } from './styles';

type ClientRowProps = {
  cols: string[];
  data: IPrepayment;
}

const PrepaymentRow = (props: ClientRowProps) => {
  const { t } = useTranslation();
  const { data } = props;

  const user = data.user as IUser;
  const project = user.project as IProject;
  const client = project?.client as IClient;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { updatePrepayment, removePrepayment } = usePrepaymentMutations();

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
        {getDateFromIso(data.paymentDate, 'MM/yyyy')}
      </ListTableCell>
      <ListTableCell>
        {Number(data.sum).toFixed(2)}€
      </ListTableCell>
      <ListTableCell>
        {data.adminComment}
      </ListTableCell>
      <ListTableCell>
        <StatusLabel className={data.status}>{t(`selects.prepaymentStatus.${data.status}`)}</StatusLabel>
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.paymentDate)}
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.createdAt, 'dd.MM.yyyy HH:mm')}
      </ListTableCell>
      <ListTableCell>
        <Link to={`/profile/${data.createdBy?._id}`} className="table-link">
          {data.createdBy?.fullname}
        </Link>
      </ListTableCell>
      <ListTableCell>
        <Link to={`/profile/${data.updatedBy?._id}`} className="table-link">
          {data.updatedBy?.fullname}
        </Link>
      </ListTableCell>
      <ListTableCell>
        <IconButton onClick={() => void setOpenDialog(true)}><EditIcon /></IconButton>
        <IconButton onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
      </ListTableCell>
      {!!openDialog && (
        <PrepaymentDialog
          open={openDialog}
          onClose={() => void setOpenDialog(false)}
          onSave={(values: Partial<IPrepayment>) => {
            setOpenDialog(false);
            updatePrepayment(data, values);
          }}
          data={data}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          open={openDeleteDialog}
          onSubmit={() => {
            setOpenDeleteDialog(false);
            removePrepayment(data);
          }}
          onClose={() => void setOpenDeleteDialog(false)}
        />
      )}
    </ListTableRow>
  );
};
export default PrepaymentRow;
