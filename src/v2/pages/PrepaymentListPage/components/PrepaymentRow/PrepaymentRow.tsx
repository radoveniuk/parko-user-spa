import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTableSelectedItems } from 'v2/contexts/TableSelectedItemsContext';
import { getCurrencyString } from 'v2/helpers/currency';
import { Checkbox, Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EditIcon, ThreeDotsIcon } from 'components/icons';
import { ListTableCell } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import usePrepaymentMutations from '../../hooks/usePrepaymentMutations';
import PrepaymentDialog from '../PrepaymentDialog';

import { StyledListTableRow } from './styles';

type Props = {
  data: IPrepayment;
}

const PrepaymentRow = ({ data }: Props) => {
  const { t } = useTranslation();

  const project = data.project as IProject;
  const client = data.client as IClient;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { updatePrepayment, removePrepayment } = usePrepaymentMutations();

  const { permissions } = useAuthData();

  // select items
  const [selectedItems, { toggle: toggleSelectedRow }] = useTableSelectedItems<IPrepayment>();

  const selectRowChangeHandler = useCallback(() => {
    toggleSelectedRow(data);
  }, [data, toggleSelectedRow]);

  return (
    <StyledListTableRow>
      <ListTableCell>
        <Checkbox
          checked={selectedItems.some((selectedItem) => selectedItem._id === data._id)}
          onChange={selectRowChangeHandler}
        />
      </ListTableCell>
      <ListTableCell>
        {data.user
          ? (
            <Link to={`/profile/${(data.user as IUser)._id}`} className="table-link">
              {data.userFullname}
            </Link>
          )
          : data.userFullname
        }
      </ListTableCell>
      <ListTableCell>
        {client?.shortName}
      </ListTableCell>
      <ListTableCell>
        {project?.name}
      </ListTableCell>
      <ListTableCell>
        <StatusLabel className={data.userStatus}>{t(`selects.userStatus.${data.userStatus}`)}</StatusLabel>
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.period, 'MM/yyyy')}
      </ListTableCell>
      <ListTableCell>
        {getCurrencyString(data.sum)}
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
        {(permissions.includes('prepayments:update') || permissions.includes('prepayments:delete')) && (
          <Menu className="menu-btn" menuComponent={<IconButton><ThreeDotsIcon /></IconButton>}>
            {permissions.includes('prepayments:update') && (
              <MenuItem onClick={() => void setOpenDialog(true)}><EditIcon />{t('edit')}</MenuItem>
            )}
            {permissions.includes('prepayments:delete') && (
              <MenuItem onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon />{t('delete')}</MenuItem>
            )}
          </Menu>
        )}
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
    </StyledListTableRow>
  );
};
export default memo(PrepaymentRow);
