import React, { memo, useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutoComplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { useGetClients } from 'api/query/clientQuery';
import { useGetPropertyMovements } from 'api/query/propertyMovementQuery';
import { useGetProperties } from 'api/query/propertyQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { getDateFromIso } from 'helpers/datetime';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IPropertyMovement, PropertyMovementType } from 'interfaces/propertyMovement.interface';

import usePropertyMovementActions from '../Movements/hooks/useMovementActions';

// import usePropertyActions from '../Properties/hooks/usePropertyActions';
import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  defaultData?: IPropertyMovement<true>;
  type: PropertyMovementType;
};

const WRITE_OFF_REASON_OPTIONS = ['damaged', 'non-returnable', 'not-returned'];

const MovementFormDialog = ({ defaultData, onClose, type, ...rest }: Props) => {
  const prepareDefaultData = (data: IPropertyMovement<true>): IPropertyMovement => {
    const result: IPropertyMovement = {
      ...data,
      user: data.user._id,
      project: data.project._id,
      client: data.client._id,
      contractor: data.contractor._id,
      recorder: data.recorder._id,
      property: data.property._id,
      previousMovement: data.previousMovement?._id,
      createdBy: data.createdBy._id,
      updatedBy: data.updatedBy._id,
    };
    return result;
  };

  const { t } = useTranslation();

  const translatedWriteOffOptions = useTranslatedSelect(WRITE_OFF_REASON_OPTIONS, 'writeOffReason');

  const { register, control, formState: { errors }, handleSubmit, watch, setValue, clearErrors } =
  useForm<IPropertyMovement>({ defaultValues: defaultData ? prepareDefaultData(defaultData) : { type } });

  const { data: users = [], isFetching: isFetchingUsers } = useGetUserListForFilter({}, { enabled: type !== 'return' });
  const { data: recorders } = useGetUserListForFilter({ isInternal: true });
  const { data: properties = [], isFetching: isFetchingProperties } = useGetProperties({}, { enabled: type !== 'return', staleTime: 0 });
  const { data: previousGiveMovements = [] } = useGetPropertyMovements({ type: 'give', isReturned: false });
  const { data: contractors = [] } = useGetClients({ isInternal: true });

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

  const translatedType = t(`selects.propertyMovementType.${type}`);

  return (
    <Dialog
      mobileFullscreen
      title={defaultData ? `${defaultData?.property.internalName} ${translatedType}` : translatedType}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          {type === 'give' && (
            <>
              <Controller
                control={control}
                name="property"
                render={({ field }) => (
                  <AutoComplete
                    label={t('stock.property')}
                    options={properties}
                    value={properties.find(item => item._id === field.value)}
                    onChange={(v) => void field.onChange(v?._id)}
                    theme="gray"
                    getOptionLabel={row => `${row.internalName} (${row.availableCount})`}
                    valueKey="_id"
                    disabled={isFetchingProperties}
                  />
                )}
              />
              <Controller
                control={control}
                name="contractor"
                render={({ field }) => (
                  <Select
                    label={t('stock.contractor')}
                    options={contractors}
                    onChange={(e) => void field.onChange(e.target.value)}
                    theme="gray"
                    labelPath="shortName"
                    valuePath="_id"
                  />
                )}
              />
              {!!selectedProperty && (
                <>
                  <Input
                    label={t('stock.distributorICO')}
                    value={selectedProperty.distributorICO}
                    disabled
                  />
                  <Input
                    label={t('stock.orderer')}
                    value={selectedProperty.orderer.shortName}
                    disabled
                  />
                  <Input
                    label={t('stock.price')}
                    value={selectedProperty.price}
                    InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
                    disabled
                  />
                  <Input
                    label={t('stock.damageCompencationPrice')}
                    value={selectedProperty.damageCompencationPrice}
                    InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
                    disabled
                  />
                  <Input
                    label={t('stock.receiver')}
                    value={selectedProperty.receiver.fullname}
                    disabled
                  />
                  <Input
                    label={t('stock.size')}
                    value={selectedProperty.size}
                    disabled
                  />
                </>
              )}
            </>
          )}
          {type === 'return' && (
            <>
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
                    disabled={isFetchingUsers}
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
            </>
          )}
          {type === 'writeoff' && (
            <>
              <Controller
                control={control}
                name="property"
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <AutoComplete
                    label={t('stock.property')}
                    options={properties}
                    value={properties.find(item => item._id === field.value)}
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
              <Controller
                control={control}
                name="previousMovement"
                rules={{
                  onChange (e) {
                    const movement = previousGiveMovements.find(item => item._id === e.target.value);
                    if (movement) {
                      setValue('contractor', movement.contractor._id);

                      setValue('user', movement.user._id);
                    }
                  },
                }}
                render={({ field }) => (
                  <AutoComplete
                    label={t('selects.propertyMovementType.give')}
                    options={previousGiveMovements}
                    value={previousGiveMovements.find(item => item._id === field.value)}
                    onChange={(v) => void field.onChange(v?._id)}
                    theme="gray"
                    getOptionLabel={(row: IPropertyMovement<true>) =>
                      `${row.property.internalName}, ${row.user.fullname}, ${getDateFromIso(row.date)}`}
                    valueKey="_id"
                    disabled={isFetchingUsers}
                  />
                )}
              />
            </>
          )}
          {type !== 'return' && (
            <Controller
              control={control}
              name="user"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <AutoComplete
                  label={t('stock.user')}
                  options={users}
                  value={users.find(user => user._id === field.value)}
                  onChange={(v) => void field.onChange(v?._id)}
                  theme="gray"
                  getOptionLabel={row => `${row.fullname}${row.project ? `, ${row.project.client.shortName} > ${row.project.name}` : ''}`}
                  valueKey="_id"
                  disabled={isFetchingUsers}
                  required
                  error={!!fieldState.error}
                />
              )}
            />
          )}
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
                  if (selectedProperty) {
                    if (type === 'give') {
                      return count <= selectedProperty.availableCount;
                    }
                  }

                  return count > 0;
                },
              },
            })}
          />
          {type === 'writeoff' && (
            <>
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
            </>
          )}
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
