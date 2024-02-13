import React, { CSSProperties, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Avatar } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DayoffIcon, DeleteIcon, EditIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import useDayoffMutations from '../../hooks/usePrepaymentMutations';
import PrepaymentDialog from '../DayoffDialog';

import { MobileClientCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  data: IDayOff & { user: IUser };
};

const MobilePrepaymentCard = ({ style, data }: Props) => {
  const { t } = useTranslation();

  const user = data.user;
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
    if (msNow > msEnd) {
      return 'finished';
    }
    if (msNow < msStart) {
      return 'future';
    }
  }, [data.dateEnd, data.dateStart]);

  const dayoffDescription = useMemo(() => {
    const dateStart = getDateFromIso(data.dateStart);
    const dateEnd = getDateFromIso(data.dateEnd);
    if (dateStart === dateEnd) {
      return dateStart;
    }
    return `${getDateFromIso(data.dateStart)} - ${getDateFromIso(data.dateEnd)}`;
  }, [data.dateEnd, data.dateStart]);

  return (
    <MobileClientCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(data.createdAt)}</div>
        <Link to={`/profile/${data.user._id}`} className="user">
          <Avatar size={40} color={themeConfig.palette.primary.light} username={`${data.user.name} ${data.user.surname}`} />
          <div className="info">
            <div>{data.user.name} {data.user.surname}</div>
            <div className="side-info">
              <StatusLabel className={data.user.status}>{t(`selects.userStatus.${data.user.status}`)}</StatusLabel>
              {!!project && <div className="project">{client ? `${client.name} > ` : ''}{project?.name}</div>}
            </div>
          </div>
        </Link>
        <div className="prepayment">
          <div className="row">
            <DayoffIcon size={20} />
            {dayoffDescription}
          </div>
          <div className="row">
            <StatusLabel className={dayoffStatus}>{t(`selects.dayoffStatus.${dayoffStatus}`)}</StatusLabel>
          </div>
        </div>
        <div className="actions">
          <IconButton onClick={() => void setOpenDialog(true)}><EditIcon /></IconButton>
          <IconButton onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
        </div>
      </div>
      {!!openDialog && (
        <PrepaymentDialog
          open={openDialog}
          onClose={() => void setOpenDialog(false)}
          onSave={(values: Partial<IDayOff>) => {
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
    </MobileClientCardWrapper>
  );
};

export default memo(MobilePrepaymentCard);
