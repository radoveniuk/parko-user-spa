import React, { CSSProperties, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { EyeIcon, GoalIcon, RecruiterIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IOrder } from 'interfaces/order.interface';

import { MobileOrderCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  order: IOrder<true>;
};

const MobileOrderCard = ({ style, order }: Props) => {
  const { t } = useTranslation();

  return (
    <MobileOrderCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(order.createdAt)}</div>
        <div className="header">
          <div className="name">{order.name}</div><StatusLabel className={order.status}>{t(`selects.orderStatus.${order.status}`)}</StatusLabel>
        </div>
        <div className="project">{order.client.shortName} {'>'} {order.project.name}</div>
        <a href={order.specificationUrl} target="_blank" rel="noreferrer"><RecruiterIcon />{t('order.specificationUrl')}</a>
        <div className="goal"><GoalIcon />{t('order.goal')}: {order.goal}</div>
        <div className="actions">
          <Link to={`/order/${order._id}`}><IconButton><EyeIcon /></IconButton></Link>
        </div>
      </div>
    </MobileOrderCardWrapper>
  );
};

export default memo(MobileOrderCard);
