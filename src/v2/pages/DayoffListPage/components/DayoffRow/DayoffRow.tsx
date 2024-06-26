import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTableSelectedItems } from 'v2/contexts/TableSelectedItemsContext';
import { Checkbox, Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import downloadFile from 'api/query/downloadFile';
import { DeleteIcon, EditIcon, ThreeDotsIcon } from 'components/icons';
import { ListTableCell } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IFile } from 'interfaces/file.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { getDayoffStatus } from '../../helpers/status';
import useDayoffMutations from '../../hooks/usePrepaymentMutations';
import DayoffDialog from '../DayoffDialog';

import { StyledListTableRow } from './styles';

type RowProps = {
  cols: string[];
  data: IDayOff;
}

const DayoffRow = (props: RowProps) => {
  const { t } = useTranslation();
  const { data } = props;

  const project = data.project as IProject;
  const client = data.client as IClient;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { updateDayoff, removeDayoff } = useDayoffMutations();

  const dayoffStatus = useMemo(() => getDayoffStatus(data.dateStart, data.dateEnd), [data.dateEnd, data.dateStart]);

  const { permissions } = useAuthData();

  // select items
  const [selectedItems, { toggle: toggleSelectedRow }] = useTableSelectedItems<IDayOff>();

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
        <StatusLabel className={dayoffStatus}>{t(`selects.dayoffStatus.${dayoffStatus}`)}</StatusLabel>
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.dateStart)}
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.dateEnd)}
      </ListTableCell>
      <ListTableCell>
        {data.reason && t(`selects.dayoffReason.${data.reason}`)}
      </ListTableCell>
      <ListTableCell>
        {data.adminComment}
      </ListTableCell>
      <ListTableCell>
        <ul className="doc-list">
          {data.docs?.map((docItem) => {
            const doc = docItem as IFile;
            return (
              <li key={doc._id}><a onClick={() => downloadFile(doc._id, doc.originalname, doc.ext)}>{doc.originalname}.{doc.ext}</a></li>
            );
          })}
        </ul>
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.createdAt, 'dd.MM.yyyy HH:mm')}
      </ListTableCell>
      <ListTableCell>
        {data.createdBy?.fullname}
      </ListTableCell>
      <ListTableCell>
        {data.updatedBy?.fullname}
      </ListTableCell>
      <ListTableCell>
        {(permissions.includes('daysoff:update') || permissions.includes('prepayments:delete')) && (
          <Menu className="menu-btn" menuComponent={<IconButton><ThreeDotsIcon /></IconButton>}>
            {permissions.includes('daysoff:update') && (
              <MenuItem onClick={() => void setOpenDialog(true)}><EditIcon />{t('edit')}</MenuItem>
            )}
            {permissions.includes('daysoff:delete') && (
              <MenuItem onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon />{t('delete')}</MenuItem>
            )}
          </Menu>
        )}
      </ListTableCell>
      {!!openDialog && (
        <DayoffDialog
          open={openDialog}
          onClose={() => void setOpenDialog(false)}
          onSave={(values) => {
            setOpenDialog(false);
            updateDayoff(data, values);
          }}
          data={data}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          open={openDeleteDialog}
          onSubmit={() => {
            setOpenDeleteDialog(false);
            removeDayoff(data);
          }}
          onClose={() => void setOpenDeleteDialog(false)}
        />
      )}
    </StyledListTableRow>
  );
};
export default DayoffRow;
