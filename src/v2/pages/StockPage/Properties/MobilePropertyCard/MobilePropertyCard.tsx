import React, { CSSProperties, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useBoolean from 'v2/hooks/useBoolean';
import { Avatar } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { useGetPropertyMovements } from 'api/query/propertyMovementQuery';
import { BoxIcon, DeleteIcon, EditIcon, LocationIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IProperty } from 'interfaces/property.interface';
import { themeConfig } from 'theme';

import PropertyFormDialog from '../../dialogs/PropertyFormDialog';
import usePropertyActions from '../hooks/usePropertyActions';

import { MobileCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  data: IProperty<true>;
};

const MobilePropertyCard = ({ style, data }: Props) => {
  const { t } = useTranslation();

  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const { data: movements = [] } = useGetPropertyMovements();

  const movementsCount = useMemo(() => movements.filter((movement) => movement.property._id === data._id).length, [data._id, movements]);

  const { permissions } = useAuthData();

  const [isOpenEdit, openEdit, closeEdit] = useBoolean(false);

  const { remove } = usePropertyActions();

  return (
    <MobileCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(data.createdAt)}</div>
        <div className="user">
          <Avatar sx={{ bgcolor: themeConfig.palette.secondary.main }} size={40}>
            <BoxIcon color="#1c1c1c" />
          </Avatar>
          <div className="info">
            <div>{data.internalName}, {data.availableCount}</div>
            <div className="side-info">
              <StatusLabel className={data.status}>
                {t(`selects.propertyStatus.${data.status}`)}
              </StatusLabel>
              <div className="project">{t('stock.price')}: {data.price}</div>
            </div>
          </div>
        </div>
        <div className="prepayment">
          <div className="row">
            <LocationIcon size={20} />
            {data.location}
          </div>
        </div>
        <div className="actions">
          {permissions.includes('stock:update') && (
            <IconButton onClick={openEdit}><EditIcon /></IconButton>
          )}
          {permissions.includes('stock:delete') && (
            <IconButton disabled={!!movementsCount} onClick={() => void setIdToDelete(data._id)}><DeleteIcon /></IconButton>
          )}
        </div>
      </div>
      {!!idToDelete && (
        <DialogConfirm
          onClose={() => void setIdToDelete(null)}
          open={!!idToDelete}
          onSubmit={() => {
            remove(idToDelete);
            setIdToDelete(null);
          }}
        />
      )}
      {isOpenEdit && (
        <PropertyFormDialog
          defaultData={data}
          open={isOpenEdit}
          onClose={closeEdit}
        />
      )}
    </MobileCardWrapper>
  );
};

export default memo(MobilePropertyCard);
