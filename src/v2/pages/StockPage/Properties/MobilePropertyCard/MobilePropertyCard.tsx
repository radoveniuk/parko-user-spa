import React, { CSSProperties, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import useBoolean from 'v2/hooks/useBoolean';
import { Avatar } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { useDeleteAccommodation } from 'api/mutations/accommodationMutation';
import { useGetPropertyMovements } from 'api/query/propertyMovementQuery';
import { BoxIcon, DeleteIcon, EditIcon, LocationIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IProperty } from 'interfaces/property.interface';
import { themeConfig } from 'theme';

import PropertyFormDialog from '../../dialogs/PropertyFormDialog';

import { MobileCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  data: IProperty<true>;
};

const MobileAccommodationCard = ({ style, data }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const deleteAccommodation = useDeleteAccommodation();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const { data: movements = [] } = useGetPropertyMovements();

  const movementsCount = useMemo(() => movements.filter((movement) => movement.property._id === data._id).length, [data._id, movements]);

  const { permissions } = useAuthData();

  const [isOpenEdit, openEdit, closeEdit] = useBoolean(false);

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
          {permissions.includes('accommodations:update') && (
            <IconButton onClick={openEdit}><EditIcon /></IconButton>
          )}
          {permissions.includes('accommodations:delete') && (
            <IconButton disabled={!!movementsCount} onClick={() => void setIdToDelete(data._id)}><DeleteIcon /></IconButton>
          )}
        </div>
      </div>
      {!!idToDelete && (
        <DialogConfirm
          onClose={() => void setIdToDelete(null)}
          open={!!idToDelete}
          onSubmit={() => {
            deleteAccommodation.mutateAsync(idToDelete as string).then(() => {
              const prevAccommodations = queryClient.getQueryData(['accommodations', JSON.stringify({})]) as IAccommodation[];
              queryClient.setQueryData(['accommodations', JSON.stringify({})], prevAccommodations.filter((item) => item._id !== idToDelete));
              setIdToDelete(null);
            });
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

export default memo(MobileAccommodationCard);
