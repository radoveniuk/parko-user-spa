import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import downloadFile from 'api/query/downloadFile';
import { DeleteIcon, EditIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IFile } from 'interfaces/file.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import useDayoffMutations from '../../hooks/usePrepaymentMutations';
import DayoffDialog from '../DayoffDialog';

import { LinkWrapper } from './styles';

type RowProps = {
  cols: string[];
  data: IDayOff;
}

const DayoffRow = (props: RowProps) => {
  const { t } = useTranslation();
  const { data } = props;

  const user = data.user as IUser;
  const project = user.project as IProject;
  const client = project?.client as IClient;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { updateDayoff, removeDayoff } = useDayoffMutations();

  const dayoffStatus = useMemo(() => {
    const msStart = DateTime.fromISO(data.dateStart).startOf('day').toMillis();
    const msEnd = DateTime.fromISO(data.dateEnd).endOf('day').toMillis();
    const msNow = DateTime.now().toMillis();
    if (msNow > msStart && msNow < msEnd) {
      return 'continues';
    }
    if (data.dateEnd && msNow > msEnd) {
      return 'finished';
    }
    if (msNow < msStart) {
      return 'future';
    }
    return 'continues';
  }, [data.dateEnd, data.dateStart]);

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
        {data.description}
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
export default DayoffRow;
