import React, { CSSProperties, memo, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { Avatar } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EditIcon, GiveUserIcon, ReturnFromUserIcon, UnboxIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IPropertyMovement, PropertyMovementType } from 'interfaces/propertyMovement.interface';
import { themeConfig } from 'theme';

import usePropertyMovementActions from '../hooks/useMovementActions';

import { MobileCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  data: IPropertyMovement<true>;
};

const TypeIconMap: Record<PropertyMovementType, ReactNode> = {
  give: <GiveUserIcon size={20} />,
  return: <ReturnFromUserIcon size={20} />,
  writeoff: <UnboxIcon size={20} />,
};

const MobileMovementCard = ({ style, data }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const { permissions } = useAuthData();

  const { remove } = usePropertyMovementActions();

  const allMovements = queryClient.getQueryData(['property-movements', '{}']) as IPropertyMovement<true>[] | undefined;
  const checkFutureMovements = (movementId: string) => allMovements?.some((movement) => movement.previousMovement?._id === movementId);

  return (
    <MobileCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(data.date)}</div>
        <Link to={`/profile/${data.user._id}`} className="user">
          <Avatar size={40} color={themeConfig.palette.primary.light} username={data.user.fullname} />
          <div className="info">
            <div>{data.user.fullname}</div>
            <div className="side-info">
              <StatusLabel className={data.userStatus}>{t(`selects.userStatus.${data.userStatus}`)}</StatusLabel>
              {!!data.project && <div className="project">{data.client ? `${data.client.shortName} > ` : ''}{data.project?.name}</div>}
            </div>
          </div>
        </Link>
        <div className="prepayment">
          <div className="row">
            {TypeIconMap[data.type]}
            {data.property.internalName}, {data.count}
          </div>
        </div>
        <div className="actions">
          {permissions.includes('residences:update') && (
            <IconButton onClick={() => {}}><EditIcon /></IconButton>
          )}
          {permissions.includes('residences:delete') && (
            <IconButton onClick={() => void setIdToDelete(data._id)} disabled={checkFutureMovements(data._id)}><DeleteIcon /></IconButton>
          )}
        </div>
      </div>
      {!!idToDelete && (
        <DialogConfirm
          onClose={() => void setIdToDelete(null)}
          open={!!idToDelete}
          onSubmit={() => {
            remove(idToDelete);
          }}
        />
      )}
    </MobileCardWrapper>
  );
};

export default memo(MobileMovementCard);
