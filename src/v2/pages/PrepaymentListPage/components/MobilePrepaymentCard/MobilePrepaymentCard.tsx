import React, { CSSProperties, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Avatar } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EditIcon, MoneyBillIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import { MobileClientCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  prepayment: IPrepayment & { user: IUser };
};

const MobilePrepaymentCard = ({ style, prepayment }: Props) => {
  const { t } = useTranslation();

  const user = prepayment.user;
  const project = user.project as IProject;

  return (
    <MobileClientCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(prepayment.createdAt)}</div>
        <Link to={`/profile/${prepayment.user._id}`} className="user">
          <Avatar size={40} color={themeConfig.palette.primary.light} username={`${prepayment.user.name} ${prepayment.user.surname}`} />
          <div className="info">
            <div>{prepayment.user.name} {prepayment.user.surname}</div>
            <div className="side-info">
              <StatusLabel className={prepayment.user.status}>{t(`selects.userStatus.${prepayment.user.status}`)}</StatusLabel>
              <div className="project">{project.name}</div>
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
          <IconButton>
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
    </MobileClientCardWrapper>
  );
};

export default memo(MobilePrepaymentCard);
