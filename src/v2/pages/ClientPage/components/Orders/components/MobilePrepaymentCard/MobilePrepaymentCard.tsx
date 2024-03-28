import React, { CSSProperties, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import OrderFormDialog from 'v2/components/OrderFormDialog';
import { Avatar } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EditIcon, MoneyBillIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IOrder } from 'interfaces/order.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

// import usePrepaymentMutations from '../../hooks/usePrepaymentMutations';
import { MobileClientCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  order: IOrder<true>;
};

const MobilePrepaymentCard = ({ style, order }: Props) => {
  const { t } = useTranslation();

  // const user = prepayment.user;
  const project = order.project as IProject;
  const client = project?.client as IClient;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // const { updatePrepayment, removePrepayment } = usePrepaymentMutations();

  return (
    <MobileClientCardWrapper style={style}>
      {/* <div className="card">
        <div className="date">{getDateFromIso(prepayment.createdAt)}</div>
        <Link to={`/profile/${prepayment.user._id}`} className="user">
          <Avatar size={40} color={themeConfig.palette.primary.light} username={`${prepayment.user.name} ${prepayment.user.surname}`} />
          <div className="info">
            <div>{prepayment.user.name} {prepayment.user.surname}</div>
            <div className="side-info">
              <StatusLabel className={prepayment.user.status}>{t(`selects.userStatus.${prepayment.user.status}`)}</StatusLabel>
              {!!project && <div className="project">{client ? `${client.name} > ` : ''}{project?.name}</div>}
            </div>
          </div>
        </Link>
        <div className="prepayment">
          <div className="row">
            <MoneyBillIcon size={20} />
            {Number(prepayment.sum).toFixed(2)}€
            <StatusLabel className={prepayment.status}>{t(`selects.orderstatus.${prepayment.status}`)}</StatusLabel>
          </div>
        </div>
        <div className="actions">
          <IconButton onClick={() => void setOpenDialog(true)}><EditIcon /></IconButton>
          <IconButton onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
        </div>
      </div> */}
      {!!openDialog && (
        <OrderFormDialog
          open={openDialog}
          onClose={() => void setOpenDialog(false)}
          onSave={(values: Partial<IOrder>) => {
            setOpenDialog(false);
            // updatePrepayment(prepayment, values);
          }}
          data={order}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          open={openDeleteDialog}
          onSubmit={() => {
            setOpenDeleteDialog(false);
            // removePrepayment(prepayment);
          }}
          onClose={() => void setOpenDeleteDialog(false)}
        />
      )}
    </MobileClientCardWrapper>
  );
};

export default memo(MobilePrepaymentCard);
