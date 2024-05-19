import React, { memo, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutoComplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { useGetPropertyMovements } from 'api/query/propertyMovementQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { getDateFromIso } from 'helpers/datetime';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

import { movementExtendedToForm } from '../helpers';
import usePropertyMovementActions from '../Movements/hooks/useMovementActions';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  defaultData?: IPropertyMovement<true>;
}

const ReturnDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();

  const { register, control, formState: { errors }, handleSubmit, watch, setValue } =
  useForm<IPropertyMovement>({ defaultValues: defaultData ? movementExtendedToForm(defaultData) : { type: 'return' } });

  const { data: recorders } = useGetUserListForFilter({ isInternal: true });

  const { data: previousGiveMovements = [], isFetching: isFetchingMovements } = useGetPropertyMovements({ type: 'give', isReturned: false });

  const { create, update } = usePropertyMovementActions();

  const submitHandler: SubmitHandler<IPropertyMovement> = (data) => {
    if (defaultData) {
      update(data);
    } else {
      create(data);
    }
    onClose();
  };

  const selectedPrevMovementId = watch('previousMovement');
  const selectedPrevMovement = useMemo(() =>
    previousGiveMovements.find(movement => movement._id === selectedPrevMovementId), [previousGiveMovements, selectedPrevMovementId]);

  const translatedType = t('selects.propertyMovementType.return');

  return (
    <Dialog
      mobileFullscreen
      title={defaultData ? `${defaultData?.property.internalName} ${translatedType}` : translatedType}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Controller
            control={control}
            name="previousMovement"
            rules={{
              onChange (e) {
                const movement = previousGiveMovements.find(item => item._id === e.target.value);
                if (movement) {
                  setValue('count', movement.count);
                  setValue('property', movement.property._id);
                  setValue('user', movement.user._id);
                  setValue('contractor', movement.contractor._id);
                }
              },
              required: true,
            }}
            render={({ field, fieldState }) => (
              <AutoComplete
                label={t('stock.property')}
                options={previousGiveMovements}
                value={previousGiveMovements.find(item => item._id === field.value)}
                onChange={(v) => void field.onChange(v?._id)}
                theme="gray"
                getOptionLabel={(row: IPropertyMovement<true>) =>
                  `${row.property.internalName}, ${row.user.fullname}, ${getDateFromIso(row.date)}`}
                valueKey="_id"
                disabled={isFetchingMovements}
                required
                error={!!fieldState.error}
              />
            )}
          />
          <Input
            disabled
            label={t('stock.user')}
            value={selectedPrevMovement?.user.fullname}
          />
          <Input
            label={t('stock.count')}
            theme="gray"
            type="number"
            error={!!errors.count}
            required
            {...register('count', {
              required: true,
              validate: {
                limit: (value) => {
                  const count = Number(value);
                  if (selectedPrevMovement) {
                    return count <= selectedPrevMovement.count;
                  }

                  return count > 0;
                },
              },
            })}
          />
          <Controller
            control={control}
            name="date"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <DatePicker
                label={t('stock.date')}
                inputProps={{ theme: 'gray', required: true }}
                onChange={field.onChange}
                defaultValue={field.value}
                error={!!fieldState.error}
              />
            )}
          />
          <Controller
            control={control}
            name="recorder"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                label={t('stock.recorder')}
                options={recorders}
                value={field.value}
                onChange={(e) => void field.onChange(e.target.value)}
                theme="gray"
                labelPath="fullname"
                valuePath="_id"
                required
                error={!!fieldState.error}
              />
            )}
          />
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit(submitHandler)}>{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ReturnDialog);
