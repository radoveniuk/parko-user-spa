import React, { CSSProperties, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Avatar } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { useDeleteAccommodation } from 'api/mutations/accommodationMutation';
import { BuildingIcon, DeleteIcon, EditIcon, LocationIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';
import { themeConfig } from 'theme';

import { useActiveAccommodation } from '../../contexts/AccommodationContext';

import { MobileCardWrapper } from './styles';

type Props = {
  style?: CSSProperties;
  data: IAccommodation;
};

const MobileAccommodationCard = ({ style, data }: Props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [, setOpenAccommodation] = useActiveAccommodation();
  const deleteAccommodation = useDeleteAccommodation();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const allResidences: IResidence[] = queryClient.getQueryData(['residences', JSON.stringify({})]) || [];

  const residencesCount = useMemo(() =>
    allResidences.filter((residence) => (residence.accommodation as IAccommodation)._id === data._id && !residence.checkOutDate).length,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [data._id]);

  return (
    <MobileCardWrapper style={style}>
      <div className="card">
        <div className="date">{getDateFromIso(data.createdAt)}</div>
        <div className="user">
          <Avatar sx={{ bgcolor: themeConfig.palette.secondary.main }} size={40}>
            <BuildingIcon color="#1c1c1c" />
          </Avatar>
          <div className="info">
            <div>{data.owner}</div>
            <div className="side-info">
              <StatusLabel className={residencesCount ? 'active' : 'inactive'}>
                {t('accommodation.residences')}:{' '}
                {allResidences.filter((residence) => (residence.accommodation as IAccommodation)._id === data._id && !residence.checkOutDate).length}
              </StatusLabel>
              {!!data.tariff && <div className="project">{t('accommodation.tariff')}: {t(`selects.accommodationTariff.${data.tariff}`)}</div>}
            </div>
          </div>
        </div>
        <div className="prepayment">
          <div className="row">
            <LocationIcon size={20} />
            {data.adress}
          </div>
        </div>
        <div className="actions">
          <IconButton onClick={() => void setOpenAccommodation(data)}><EditIcon /></IconButton>
          <IconButton disabled={!!residencesCount} onClick={() => void setIdToDelete(data._id)}><DeleteIcon /></IconButton>
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
    </MobileCardWrapper>
  );
};

export default memo(MobileAccommodationCard);
