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
import { IDayOff } from 'interfaces/dayoff.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import useDayoffMutations from '../../hooks/usePrepaymentMutations';
import DayoffDialog from '../DayoffDialog';

import { useDayoffRowContext } from './context';
import { LinkWrapper } from './styles';

const InfoRow = () => {
  const { t } = useTranslation();
  const { data } = useDayoffRowContext();

  const user = data.user as IUser;
  const project = user.project as IProject;
  const client = project?.client as IClient;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { updateDayoff, removeDayoff } = useDayoffMutations();

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
        {getDateFromIso(data.dateStart)}
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.dateEnd)}
      </ListTableCell>
      <ListTableCell>
        {t(`selects.dayoffReason.${data.reason}`)}
      </ListTableCell>
      <ListTableCell>
        {data.description}
      </ListTableCell>
      <ListTableCell>
        {data.adminComment}
      </ListTableCell>
      <ListTableCell>
        <IconButton onClick={() => void setOpenDialog(true)}><EditIcon /></IconButton>
        <IconButton onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
      </ListTableCell>
      {!!openDialog && (
        <DayoffDialog
          open={openDialog}
          onClose={() => void setOpenDialog(false)}
          onSave={(values: Partial<IPrepayment>) => {
            setOpenDialog(false);
            updateDayoff(data, values as Partial<IDayOff>);
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
    </ListTableRow>
  );
};

export default InfoRow;
