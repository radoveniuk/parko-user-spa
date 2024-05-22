import React, { memo, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutoComplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Loader from 'v2/uikit/Loader';
import Select from 'v2/uikit/Select';

import { useGetPropertyMovements } from 'api/query/propertyMovementQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { getDateFromIso } from 'helpers/datetime';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

import { movementExtendedToForm } from '../helpers';
import usePropertyMovementActions from '../Movements/hooks/useMovementActions';

import { DialogContentWrapper, LoaderWrapper } from './styles';

type Props = DialogProps & {
  defaultData?: IPropertyMovement<true>;
}

const ReturnDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();

  const { register, control, formState: { errors }, handleSubmit, watch, setValue } =
  useForm<IPropertyMovement>({ defaultValues: defaultData ? movementExtendedToForm(defaultData) : { type: 'return' } });

  const { data: recorders, isFetching: isFetchingRecorders } = useGetUserListForFilter({ isInternal: true });

  const { data: previousMovements = [], isFetching: isFetchingMovements } = useGetPropertyMovements({ isReturned: false });
  const previousGiveMovements: typeof previousMovements = useMemo(() => {
    const giveMovements = previousMovements.filter(({ type }) => type === 'give');
    if (defaultData?.previousMovement) {
      if (giveMovements.length) {
        return giveMovements.map((m) => {
          if (m._id === defaultData?.previousMovement?._id) {
            return m;
          }
          return m;
        });
      } else {
        return [defaultData?.previousMovement] as typeof previousMovements;
      }
    }
    return giveMovements;
  }, [defaultData?.previousMovement, previousMovements]);

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

  const maxCount = useMemo(() => {
    if (selectedPrevMovement) {
      const initialCount = selectedPrevMovement.count;
      const nonAvailableCount = previousMovements
        .filter(m => m.previousMovement?._id === selectedPrevMovementId)
        .reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0);
      return initialCount - nonAvailableCount + (defaultData?.count || 0);
    }
    return 0;
  }, [defaultData?.count, previousMovements, selectedPrevMovement, selectedPrevMovementId]);

  const translatedType = t('selects.propertyMovementType.return');

  return (
    <Dialog
      mobileFullscreen
      title={defaultData ? `${defaultData?.property.internalName} ${translatedType}` : translatedType}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        {(isFetchingRecorders || isFetchingMovements) && (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        )}
        <div className="form">
          <Controller
            control={control}
            name="previousMovement"
            rules={{
              onChange (e) {
                const movement = previousGiveMovements.find(item => item._id === e.target.value);
                if (movement) {
                  setValue('property', movement.property._id);
                  setValue('user', movement.user._id);
                  setValue('contractor', movement.contractor?._id);
                }
              },
              required: true,
            }}
            render={({ field, fieldState }) => (
              <AutoComplete
                label={t('stock.property')}
                options={previousGiveMovements}
                defaultValue={previousGiveMovements.find(item => item._id === field.value)}
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
            required
          />
          <Input
            label={`${t('stock.count')} (max. ${maxCount})`}
            theme="gray"
            type="number"
            error={!!errors.count}
            required
            {...register('count', {
              required: true,
              validate: {
                limit: (value) => Number(value) <= maxCount,
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
