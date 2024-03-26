import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { useGetClients } from 'api/query/clientQuery';
import { useGetCustomForms } from 'api/query/customFormsQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';
import { AcceptIcon, PlusIcon } from 'components/icons';
import { CLIENT_STATUS, ORDER_COOPERATION_TYPE } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';
import { IOrder } from 'interfaces/order.interface';
import { IUser } from 'interfaces/users.interface';

import StageChip from './StageChip';
import { AddStageButton, OrderDialogContent, StageNameField, StageNameFieldWrapper } from './styles';

type Props = DialogProps & {
  onSave(values: IOrder): void;
  data?: IOrder<true>
};

const OrderDialog = ({ onSave, data, ...rest }: Props) => {
  const { t } = useTranslation();
  const statusList = useTranslatedSelect(CLIENT_STATUS, 'clientStatus');
  const cooperationTypeList = useTranslatedSelect(ORDER_COOPERATION_TYPE, 'orderCooperationType');
  const { control, register, formState: { errors }, handleSubmit, clearErrors, watch } = useForm<IOrder>();

  const { data: managers = [], isFetching: isManagersFetching } = useGetUserList({ roles: 'recruiter,admin' });
  const { data: clients } = useGetClients();
  const { data: projects } = useGetProjects();
  const { data: customForms } = useGetCustomForms();

  const submitHandler: SubmitHandler<IOrder> = (values) => {
    onSave({ ...values });
  };

  // create of a new stage
  const [showNewStageField, setShowNewStageField] = useState(false);
  const [newStageLabel, setNewStageLabel] = useState('');

  return (
    <Dialog
      mobileFullscreen
      title={t('order.order')}
      {...rest}
    >
      <OrderDialogContent>
        <div className="form">
          <Input
            label={`${t('order.name')}*`}
            defaultValue={data?.name || ''}
            error={!!errors.name}
            theme="gray"
            {...register('name', { required: true })}
          />
          <Select
            theme="gray"
            label={t('order.status')}
            error={!!errors.status}
            options={statusList}
            defaultValue={data?.status || 'active'}
            {...register('status')}
          />
          <Controller
            control={control}
            name="client"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                label={t('project.client')}
                theme="gray"
                labelPath="name"
                valuePath="_id"
                options={clients}
                defaultValue={data?.client._id}
                error={!!fieldState.error}
                value={field.value}
                onChange={(e) => {
                  clearErrors('client');
                  field.onChange(e.target.value);
                }}
                className="select-field"
              />
            )}
          />
          <Controller
            control={control}
            name="project"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                label={t('order.project')}
                theme="gray"
                labelPath={item => item.name}
                valuePath="_id"
                options={projects?.filter((projectItem) => (projectItem.client as IClient)?._id === watch('client'))}
                disabled={!watch('client')}
                defaultValue={data?.project?._id}
                error={!!fieldState.error}
                value={field.value}
                onChange={(e) => {
                  clearErrors('project');
                  field.onChange(e.target.value);
                }}
              />
            )}
          />
          <Input
            label={t('order.positionName')}
            defaultValue={data?.positionName || ''}
            theme="gray"
            {...register('positionName')}
          />
          <Controller
            control={control}
            name="cooperationType"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                label={t('order.cooperationType')}
                theme="gray"
                labelPath="label"
                valuePath="_id"
                options={cooperationTypeList}
                defaultValue={data?.cooperationType}
                error={!!fieldState.error}
                value={field.value}
                onChange={(e) => { field.onChange(e.target.value); }}
              />
            )}
          />
          <Controller
            control={control}
            name="form"
            render={({ field }) => (
              <Select
                label={t('order.form')}
                theme="gray"
                labelPath="name"
                valuePath="_id"
                options={customForms}
                defaultValue={data?.form}
                value={field.value}
                onChange={(e) => { field.onChange(e.target.value); }}
              />
            )}
          />
          <Input
            label={t('order.salary')}
            defaultValue={data?.salary || ''}
            theme="gray"
            {...register('salary')}
          />
          <Input
            label={t('order.location')}
            defaultValue={data?.location || ''}
            theme="gray"
            {...register('location')}
          />
          <Input
            label={t('order.variability')}
            defaultValue={data?.variability || ''}
            theme="gray"
            type="number"
            {...register('variability')}
          />
          <Controller
            control={control}
            name="managers"
            render={({ field }) => (
              <Autocomplete
                defaultValue={data && data.managers ? data.managers : []}
                multiple
                valueKey="_id"
                options={managers}
                loading={isManagersFetching}
                label={t('order.managers')}
                getOptionLabel={(option) => `${option.name} ${option.surname}`}
                onChange={(v) => field.onChange(v.map((item: IUser) => item._id))}
                disableCloseOnSelect
                className="fullwidth"
                limitTags={1}
                theme="gray"
              />
            )}
          />
          <Input
            label={t('order.specificationUrl')}
            defaultValue={data?.specificationUrl || ''}
            theme="gray"
            {...register('specificationUrl')}
          />
          <Input
            label={t('order.goal')}
            defaultValue={data?.goal || ''}
            theme="gray"
            type="number"
            {...register('goal')}
          />
          <Controller
            control={control}
            name="dateFrom"
            render={({ field }) => (
              <DatePicker
                inputProps={{ theme: 'gray' }}
                defaultValue={field.value}
                onChange={field.onChange}
                label={t('order.dateFrom')}
                error={!!errors.dateFrom}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="dateTo"
            render={({ field }) => (
              <DatePicker
                inputProps={{ theme: 'gray' }}
                defaultValue={field.value}
                onChange={field.onChange}
                label={t('order.dateTo')}
                error={!!errors.dateTo}
                onBlur={field.onBlur}
              />
            )}
          />
          <Input
            label={t('comment')}
            defaultValue={data?.comment || ''}
            theme="gray"
            className="fullwidth"
            {...register('comment')}
          />
        </div>
        <div className="stages">
          <div className="label">{t('order.stages')}:</div>
          <Controller
            control={control}
            name="stages"
            render={({ field }) => (
              <div className="options">
                {field.value?.map((stage) => (
                  <StageChip
                    key={stage.name}
                    data={stage}
                    onDelete={() => {
                      field.onChange(field.value.filter((item) => item.name !== stage.name));
                    }}
                    onChange={(v) => {
                      field.onChange(field.value.map((valueItem) => valueItem.name === stage.name ? v : valueItem));
                    }}
                  />
                ))}
                {!showNewStageField && (
                  <AddStageButton onClick={() => void setShowNewStageField(true)}><PlusIcon size={20} /></AddStageButton>
                )}
                {showNewStageField && (
                  <StageNameFieldWrapper>
                    <StageNameField onChange={(e) => void setNewStageLabel(e.target.value)} value={newStageLabel} />
                    <AddStageButton
                      onClick={() => {
                        if (newStageLabel && !field.value?.some(stage => stage.name === newStageLabel)) {
                          field.onChange([...(field.value || []), { name: newStageLabel, color: 'gray' }]);
                          setNewStageLabel('');
                          setShowNewStageField(false);
                        } else {
                          setNewStageLabel('');
                          setShowNewStageField(false);
                        }
                      }}
                    >
                      <AcceptIcon size={20} />
                    </AddStageButton>
                  </StageNameFieldWrapper>
                )}
              </div>
            )}
          />
        </div>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleSubmit(submitHandler)}
          >
            {t('save')}
          </Button>
        </DialogActions>
      </OrderDialogContent>
    </Dialog>
  );
};

export default OrderDialog;
