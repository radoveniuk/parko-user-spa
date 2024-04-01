import React, { memo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { Button, Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { ORDER_STAGE_COLORS } from 'constants/colors';
import { IOrderStage } from 'interfaces/order.interface';
import { IOrderParticipationStage } from 'interfaces/orderParticipation.interface';

import { FormWrapper, StageOption } from './styles';

type Props = DialogProps & {
  stageOptions: IOrderStage[];
  defaultData?: IOrderParticipationStage;
  onSubmit(v: IOrderParticipationStage): void;
}

const StageDialog = ({ onSubmit, stageOptions, defaultData, ...rest }: Props) => {
  const { register, control, handleSubmit } = useForm<IOrderParticipationStage>({ defaultValues: defaultData });
  const { t } = useTranslation();
  return (
    <Dialog {...rest}>
      <FormWrapper>
        <Controller
          control={control}
          name="stage"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <Select
              options={stageOptions}
              valuePath="name"
              labelPath={(stage) => <StageOption>
                <div className="color-dot" style={{ background: ORDER_STAGE_COLORS[stage.color][0] }} />
                <div className="name">
                  {stage.name}
                </div>
              </StageOption>}
              label={t('order.stage')}
              theme="gray"
              onChange={(e) => {
                field.onChange(stageOptions.find(option => option.name === e.target.value));
              }}
              error={!!fieldState.error}
              value={field.value.name}
            />
          )}
        />
        <Controller
          control={control}
          name="date"
          defaultValue={DateTime.now().toISO()}
          render={({ field }) => (
            <DatePicker
              defaultValue={field.value as string}
              onChange={field.onChange}
              label={t('order.stageFrom')}
              inputProps={{ theme: 'gray' }}
              format="dd.MM.yyyy HH:mm"
            />
          )}
        />
        <Input
          theme="gray"
          label={t('comment')}
          className="fullwidth"
          {...register('comment')}
        />
      </FormWrapper>
      <DialogActions>
        <Button
          onClick={handleSubmit((values) => {
            onSubmit?.(values);
          })}
          variant="contained"
        >
          {t('approve')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(StageDialog);
