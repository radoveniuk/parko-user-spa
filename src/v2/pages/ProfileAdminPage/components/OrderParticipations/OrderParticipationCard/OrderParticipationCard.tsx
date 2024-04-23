import React, { useMemo, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import OrderParticipationForm from 'v2/components/OrderParticipationForm';
import { Button } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, RecruiterIcon } from 'components/icons';
import { ORDER_STAGE_COLORS } from 'constants/colors';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import { FormCardContent, OrderParticipationCardTitleWrapper, UpdatingStatsWrapper } from './styles';

type Props = {
  data: IOrderParticipation<true>;
  onChange(values: Partial<IOrderParticipation<true>>): void;
  onDelete(): void;
};

const OrderParticipationCard = ({ data, onChange, onDelete }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();
  const formMethods = useForm<IOrderParticipation<true>>({
    defaultValues: {
      ...(data as any),
    },
  });
  const { handleSubmit, watch, reset } = formMethods;

  const submitHandler: SubmitHandler<IOrderParticipation<true>> = (values) => {
    onChange(values);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [cardKey, setCardKey] = useState(createId());

  const stages = watch('stages');
  const participationActualStage = useMemo(() => stages[stages.length - 1]?.stage, [stages]);

  return (
    <FormCardContent>
      <FormCard
        defaultConfig={{ disabled: true, viewEmployer: false, viewEmployee: false }}
        onOutsideClick={({ warn }) => { warn(); }}
        onReset={() => { setCardKey(createId()); reset(data); }}
        key={cardKey}
      >
        {({ formCardConfig, updateFormCardConfig }) => (
          <>
            <FormCardHeader
              icon={<RecruiterIcon />}
              title={(
                <OrderParticipationCardTitleWrapper>
                  {data.order.name}
                  {participationActualStage && (
                    <StatusLabel
                      style={{
                        backgroundColor: ORDER_STAGE_COLORS[participationActualStage.color][0],
                        color: ORDER_STAGE_COLORS[participationActualStage.color][1],
                      }}
                    >
                      {participationActualStage.name}
                    </StatusLabel>
                  )}
                </OrderParticipationCardTitleWrapper>
              )}
            >
              {formCardConfig.disabled && (
                <Button onClick={() => void updateFormCardConfig({ disabled: false })}>{t('edit')}</Button>
              )}
              {!formCardConfig.disabled && (
                <Button
                  color="error"
                  onClick={() => {
                    handleSubmit((values) => {
                      submitHandler(values);
                      updateFormCardConfig({ disabled: true });
                    })();
                  }}
                >
                  {t('save')}
                </Button>
              )}
            </FormCardHeader>
            <FormCardBody>
              <FormProvider {...formMethods}>
                <OrderParticipationForm disabled={formCardConfig.disabled} />
              </FormProvider>
            </FormCardBody>
            <UpdatingStatsWrapper>
              <div className="info">
                {t('order.updatedAt')}: {getDateFromIso(data.updatedAt, 'dd.MM.yyyy HH:mm')} ({data.updatedBy?.fullname || data.createdBy.fullname})
              </div>
              <div className="info">{t('order.createdAt')}: {getDateFromIso(data.createdAt, 'dd.MM.yyyy HH:mm')} ({data.createdBy.fullname})</div>
            </UpdatingStatsWrapper>
            {permissions.includes('orders:update') && (
              <IconButton className="delete-icon" onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
            )}
          </>
        )}
      </FormCard>
      <DialogConfirm
        open={openDeleteDialog}
        onClose={() => void setOpenDeleteDialog(false)}
        onSubmit={onDelete}
      />
    </FormCardContent>
  );
};

export default OrderParticipationCard;
