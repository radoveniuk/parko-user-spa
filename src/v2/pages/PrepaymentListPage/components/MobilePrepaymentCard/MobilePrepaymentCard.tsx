import React, { CSSProperties, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Avatar } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EditIcon, MoneyBillIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import usePrepaymentMutations from '../../hooks/usePrepaymentMutations';
import PrepaymentDialog from '../PrepaymentDialog';

import { MobileCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  prepayment: IPrepayment & { user: IUser };
};

const MobilePrepaymentCard = ({ style, prepayment }: Props) => {
  const { t } = useTranslation();

  const user = prepayment.user;
  const project = user?.project as IProject;
  const client = project?.client as IClient;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { updatePrepayment, removePrepayment } = usePrepaymentMutations();

  const { permissions } = useAuthData();

  if (!user) return null;

  return (
    <MobileCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(prepayment.createdAt)}</div>
        <Link to={`/profile/${prepayment.user._id}`} className="user">
          <Avatar size={40} color={themeConfig.palette.primary.light} username={`${prepayment.user.name} ${prepayment.user.surname}`} />
          <div className="info">
            <div>{prepayment.user.name} {prepayment.user.surname}</div>
            <div className="side-info">
              <StatusLabel className={prepayment.user.status}>{t(`selects.userStatus.${prepayment.user.status}`)}</StatusLabel>
              {!!project && <div className="project">{client ? `${client.shortName} > ` : ''}{project?.name}</div>}
            </div>
          </div>
        </Link>
        <div className="prepayment">
          <div className="row">
            <MoneyBillIcon size={20} />
            {Number(prepayment.sum).toFixed(2)}€
            <StatusLabel className={prepayment.status}>{t(`selects.prepaymentStatus.${prepayment.status}`)}</StatusLabel>
          </div>
        </div>
        <div className="actions">
          {permissions.includes('prepayments:update') && (
            <IconButton onClick={() => void setOpenDialog(true)}><EditIcon /></IconButton>
          )}
          {permissions.includes('prepayments:delete') && (
            <IconButton onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
          )}
          <IconButton onClick={() => void setOpenDialog(true)}><EditIcon /></IconButton>
          <IconButton onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
        </div>
      </div>
      {!!openDialog && (
        <PrepaymentDialog
          open={openDialog}
          onClose={() => void setOpenDialog(false)}
          onSave={(values: Partial<IPrepayment>) => {
            setOpenDialog(false);
            updatePrepayment(prepayment, values);
          }}
          data={prepayment}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          open={openDeleteDialog}
          onSubmit={() => {
            setOpenDeleteDialog(false);
            removePrepayment(prepayment);
          }}
          onClose={() => void setOpenDeleteDialog(false)}
        />
      )}
    </MobileCardWrapper>
  );
};

export default memo(MobilePrepaymentCard);
