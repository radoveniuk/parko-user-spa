import React, { CSSProperties, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Avatar } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EditIcon } from 'components/icons';
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
          {/* <div className="row">
            <MoneyBillIcon size={20} />
            {Number(data.sum).toFixed(2)}€
            <StatusLabel className={data.status}>{t(`selects.prepaymentStatus.${data.status}`)}</StatusLabel>
          </div> */}
        </div>
        <div className="actions">
          <IconButton>
            <IconButton onClick={() => void setOpenDialog(true)}><EditIcon /></IconButton>
          </IconButton>
          <IconButton>
            <IconButton onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
          </IconButton>
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
