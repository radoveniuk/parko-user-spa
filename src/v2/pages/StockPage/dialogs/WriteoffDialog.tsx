import React, { memo, useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutoComplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Loader from 'v2/uikit/Loader';
import Select from 'v2/uikit/Select';

// import { useGetClients } from 'api/query/clientQuery';
import { useGetPropertyMovements } from 'api/query/propertyMovementQuery';
import { useGetProperties } from 'api/query/propertyQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { getDateFromIso } from 'helpers/datetime';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

import { movementExtendedToForm } from '../helpers';
import usePropertyMovementActions from '../Movements/hooks/useMovementActions';

import { DialogContentWrapper, LoaderWrapper } from './styles';

type Props = DialogProps & {
  defaultData?: IPropertyMovement<true>;
};

const WRITE_OFF_REASON_OPTIONS = ['damaged', 'non-returnable', 'not-returned'];

const MovementFormDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();

  const translatedWriteOffOptions = useTranslatedSelect(WRITE_OFF_REASON_OPTIONS, 'writeOffReason');

  const { register, control, formState: { errors }, handleSubmit, watch, setValue, clearErrors } =
  useForm<IPropertyMovement>({ defaultValues: defaultData ? movementExtendedToForm(defaultData) : { type: 'writeoff' } });

  const { data: users = [], isFetching: isFetchingUsers } = useGetUserListForFilter();
  const { data: recorders } = useGetUserListForFilter({ isInternal: true });
  const { data: properties = [], isFetching: isFetchingProperties } = useGetProperties({}, { staleTime: 0 });
  const { data: previousMovements = [] } = useGetPropertyMovements({ isReturned: false });
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

  const selectedPropertyId = watch('property');
  const selectedProperty = useMemo(() => properties.find(property => property._id === selectedPropertyId), [properties, selectedPropertyId]);

  useEffect(() => {
    if (selectedProperty) {
      setValue('damageCompencationPrice', selectedProperty?.damageCompencationPrice);
      clearErrors(['damageCompencationPrice']);
    }
  }, [clearErrors, selectedProperty, setValue]);

  const selectedPrevMovementId = watch('previousMovement');
  const selectedPrevMovement = useMemo(() =>
    previousGiveMovements.find(movement => movement._id === selectedPrevMovementId), [previousGiveMovements, selectedPrevMovementId]);

  const maxCount = useMemo(() => {
    if (selectedProperty && !selectedPrevMovement) {
      return selectedProperty.availableCount + (!defaultData?.previousMovement ? defaultData?.count || 0 : 0);
    }
    if (selectedPrevMovement) {
      const initialCount = selectedPrevMovement.count;
      const nonAvailableCount = previousMovements
        .filter(m => m.previousMovement?._id === selectedPrevMovementId)
        .reduce((accumulator, currentValue) => accumulator + Number(currentValue.count), 0);
      return initialCount - nonAvailableCount + (defaultData?.count || 0);
    }
    return 0;
  }, [defaultData?.count, defaultData?.previousMovement, previousMovements, selectedPrevMovement, selectedPrevMovementId, selectedProperty]);

  const translatedType = t('selects.propertyMovementType.writeoff');

  return (
    <Dialog
      mobileFullscreen
      title={defaultData ? `${defaultData?.property.internalName} ${translatedType}` : translatedType}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        {(isFetchingProperties || isFetchingUsers) && (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        )}
        <div className="form">
          {!!properties.length && (
            <Controller
              control={control}
              name="property"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <AutoComplete
                  label={t('stock.property')}
                  options={properties}
                  defaultValue={properties.find(item => item._id === field.value)}
                  onChange={(v) => void field.onChange(v?._id)}
                  theme="gray"
                  getOptionLabel={row => `${row.internalName} (${row.count})`}
                  valueKey="_id"
                  disabled={isFetchingProperties}
                  required
                  error={!!fieldState.error}
                />
              )}
            />
          )}
          <Controller
            control={control}
            name="previousMovement"
            rules={{
              onChange (e) {
                const movement = previousGiveMovements.find(item => item._id === e.target.value);

                if (movement) {
                  setValue('contractor', movement.contractor?._id);
                  setValue('user', movement.user._id);
                }
              },
            }}
            render={({ field }) => (
              <AutoComplete
                label={t('selects.propertyMovementType.give')}
                options={previousGiveMovements.filter(m => m.property._id === selectedPropertyId)}
                defaultValue={previousGiveMovements.find(item => item._id === field.value)}
                onChange={(v) => void field.onChange(v?._id)}
                theme="gray"
                getOptionLabel={(row: IPropertyMovement<true>) =>
                  `${row.property.internalName}, ${row.user.fullname}, ${getDateFromIso(row.date)}`}
                valueKey="_id"
                disabled={isFetchingUsers}
              />
            )}
          />
          {!!users.length && (
            <Controller
              control={control}
              name="user"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <AutoComplete
                  label={t('stock.user')}
                  options={users}
                  defaultValue={users.find(user => user._id === field.value)}
                  onChange={(v) => void field.onChange(v?._id)}
                  theme="gray"
                  getOptionLabel={row => `${row.fullname}${row.project ? `, ${row.project.client.shortName} > ${row.project.name}` : ''}`}
                  valueKey="_id"
                  disabled={isFetchingUsers || !!selectedPrevMovement}
                  required
                  error={!!fieldState.error}
                  key={selectedPrevMovement?._id}
                />
              )}
            />
          )}
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
            name="writeoffReason"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                label={t('stock.writeoffReason')}
                options={translatedWriteOffOptions}
                value={field.value}
                onChange={(e) => void field.onChange(e.target.value)}
                theme="gray"
                labelPath="label"
                valuePath="_id"
                required
                error={!!fieldState.error}
              />
            )}
          />
          <Controller
            control={control}
            name="damageCompencationPrice"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Input
                label={t('stock.damageCompencationPrice')}
                value={field.value}
                type="number"
                onChange={(e) => void field.onChange(e.target.value)}
                theme="gray"
                InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
                required
                error={!!fieldState.error}
              />
            )}
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

export default memo(MovementFormDialog);
