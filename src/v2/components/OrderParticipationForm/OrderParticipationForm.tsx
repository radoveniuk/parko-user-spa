import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import IconButton from 'v2/uikit/IconButton';

import { EyeIcon, EyeSlashIcon } from 'components/icons';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';
import { themeConfig } from 'theme';

import { InfoWrapper, OrderParticipationFormWrapper } from './styles';

const OrderParticipationForm = () => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<IOrderParticipation<true>>();
  const [selectedInfoSection, setSelectedInfoSection] = useState<'order' | 'screaning' | null>(null);

  const infoSectionToggler = (name: 'order' | 'screaning') => () => {
    setSelectedInfoSection(prev => prev === name ? null : name);
  };

  return (
    <OrderParticipationFormWrapper>
      <InfoWrapper className="fullwidth">
        <IconButton
          className="toggle-view"
          onClick={infoSectionToggler('order')}
        >
          {selectedInfoSection !== 'order' ? <EyeIcon /> : <EyeSlashIcon color={themeConfig.palette.primary.main} />}
        </IconButton>
        <div className="title"><b>{t('order.specification')}</b></div>
        <div className={`info ${selectedInfoSection !== 'order' ? 'hide' : ''}`}>
          <div className="row">{t('order.client')}: {watch('order.client.name')}</div>
          <div className="row">{t('order.project')}: {watch('order.project.name')}</div>
          <div className="row">{t('order.status')}: {t(`selects.clientStatus.${watch('order.status')}`)}</div>
          <div className="row">{t('order.positionName')}: {watch('order.positionName')}</div>
          <div className="row">{t('order.cooperationType')}: {t(`selects.orderCooperationType.${watch('order.cooperationType')}`)}</div>
          <div className="row">{t('order.salary')}: {watch('order.salary')}</div>
          <div className="row">{t('order.location')}: {watch('order.location')}</div>
          <div className="row">{t('order.variability')}: {watch('order.variability')}</div>
          <div className="row">{t('order.managers')}: {watch('order.managers')?.map((item) => `${item.fullname}`).join(', ')}</div>
          <a className="row link" href={watch('order.specificationUrl')} target="_blank" rel="noreferrer">{t('order.specificationUrl')}</a>
        </div>
      </InfoWrapper>
      <InfoWrapper className="fullwidth">
        <IconButton
          className="toggle-view"
          onClick={infoSectionToggler('screaning')}
        >
          {selectedInfoSection !== 'screaning' ? <EyeIcon /> : <EyeSlashIcon color={themeConfig.palette.primary.main} />}
        </IconButton>
        <div className="title"><b>{t('order.screaning')}</b></div>
        <div className={`info ${selectedInfoSection !== 'screaning' ? 'hide' : ''}`}>

        </div>
      </InfoWrapper>
    </OrderParticipationFormWrapper>
  );
};

export default OrderParticipationForm;
