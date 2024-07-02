import React, { useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash-es';
import Autocomplete from 'v2/uikit/Autocomplete';
import Button from 'v2/uikit/Button';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import Input, { EuroEndAdornment } from 'v2/uikit/Input';
import Select from 'v2/uikit/Select';

import { useGetAccommodations } from 'api/query/accommodationQuery';
import { useGetClients } from 'api/query/clientQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { PROJECT_ACCOMMODATION_TARIFF_TYPE } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';
import { IProjectAccommodation } from 'interfaces/projectAccommodation.interface';

import useProjectAccommodationActions from '../ProjectAccommodations/hooks/useProjectAccommodationActions';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  data?: IProjectAccommodation<true>;
};

const ProjectAccommodationDialog = ({ data, onClose, ...rest }:Props) => {
  const { t } = useTranslation();
  const lightData: IProjectAccommodation | undefined = useMemo(() => data
    ? ({
      ...data,
      client: data.client._id,
      project: data.project._id,
      accommodation: data.accommodation._id,
      payer: data.payer._id,
    })
    : undefined
  , [data]);
  const { register, formState: { errors }, control, handleSubmit, watch } = useForm<IProjectAccommodation<false>>({ defaultValues: lightData });

  // options data
  const { data: clients = [] } = useGetClients();
  const { data: projects = [] } = useGetProjects();
  const { data: accommodations = [] } = useGetAccommodations();
  const tariffTypes = useTranslatedSelect(PROJECT_ACCOMMODATION_TARIFF_TYPE, 'projectAccommodationTariff');

  // save the form
  const { create, update } = useProjectAccommodationActions();
  const submitHandler: SubmitHandler<IProjectAccommodation> = async (values) => {
    await (data ? update({ ...values, _id: data._id }) : create(values));
    onClose();
  };

  const clientId = watch('client');

  return (
    <Dialog mobileFullscreen onClose={onClose} title={t('navbar.accommodation')} {...rest}>
      <DialogContentWrapper>
        <div className="form">
          <Controller
            control={control}
            name="client"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Autocomplete
                theme="gray"
                options={clients}
                required
                label={t('accommodation.client')}
                labelKey="shortName"
                valueKey="_id"
                onChange={(v) => void field.onChange(v?._id || '')}
                error={!!fieldState.error}
                defaultValue={clients.find((client) => client._id === field.value)}
              />
            )}
          />
          <Controller
            control={control}
            name="project"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Autocomplete
                theme="gray"
                options={projects.filter((project) => (project.client as IClient)._id === clientId)}
                required
                label={t('accommodation.project')}
                labelKey="name"
                valueKey="_id"
                onChange={(v) => void field.onChange(v?._id || '')}
                error={!!fieldState.error}
                defaultValue={projects.find((project) => project._id === field.value)}
              />
            )}
          />
          <Controller
            control={control}
            name="accommodation"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Autocomplete
                theme="gray"
                options={accommodations}
                required
                label={t('accommodation.object')}
                getOptionLabel={row => row.name || row.adress}
                valueKey="_id"
                onChange={(v) => void field.onChange(v?._id || '')}
                error={!!fieldState.error}
                defaultValue={accommodations.find((accommodation) => accommodation._id === field.value)}
              />
            )}
          />
          <Controller
            control={control}
            name="payer"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Autocomplete
                theme="gray"
                options={clients.filter((client) => client.isInternal)}
                required
                label={t('accommodation.payer')}
                labelKey="shortName"
                valueKey="_id"
                onChange={(v) => void field.onChange(v?._id || '')}
                error={!!fieldState.error}
                defaultValue={clients.find((client) => client._id === field.value)}
              />
            )}
          />
          <Select
            theme="gray"
            label={t('accommodation.damageCompencationTariff')}
            error={!!errors.damageCompencationTariff}
            required
            options={tariffTypes}
            className="form-field"
            defaultValue={data?.damageCompencationTariff || ''}
            {...register('damageCompencationTariff')}
          />
          <Input
            theme="gray"
            label={t('accommodation.damageCompencationPrice')}
            error={!!errors.damageCompencationPrice}
            helperText={errors.damageCompencationPrice?.message}
            type="number"
            className="form-field"
            InputProps={{ endAdornment: EuroEndAdornment }}
            {...register('damageCompencationPrice')}
          />
          <Select
            theme="gray"
            label={t('accommodation.reinvoicingTariff')}
            error={!!errors.reinvoicingTariff}
            required
            options={tariffTypes}
            className="form-field"
            defaultValue={data?.reinvoicingTariff || ''}
            {...register('reinvoicingTariff')}
          />
          <Input
            theme="gray"
            label={t('accommodation.reinvoicingPrice')}
            error={!!errors.reinvoicingPrice}
            helperText={errors.reinvoicingPrice?.message}
            type="number"
            className="form-field"
            InputProps={{ endAdornment: EuroEndAdornment }}
            {...register('reinvoicingPrice')}
          />
        </div>
        <div className="actions">
          <Button variant="contained" onClick={handleSubmit(submitHandler)} disabled={!isEmpty(errors)}>{t('approve')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default ProjectAccommodationDialog;
