import React, { memo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import isEmpty from 'lodash-es/isEmpty';
import Button from 'v2/uikit/Button';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Input from 'v2/uikit/Input';

import { useCreateCustomFormFieldMutation, useUpdateCustomFormFieldMutation } from 'api/mutations/customFormsMutation';
import { ICustomFormField } from 'interfaces/form.interface';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  defaultData: ICustomFormField | true;
};

const FieldDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const {
    register, formState: { errors }, handleSubmit,
  } = useForm<ICustomFormField>({ defaultValues: typeof defaultData !== 'boolean' ? defaultData : {} });
  const createField = useCreateCustomFormFieldMutation();
  const updateField = useUpdateCustomFormFieldMutation();
  const queryClient = useQueryClient();
  const queryKey = ['customFormFields', JSON.stringify({})];

  const submitHandler: SubmitHandler<ICustomFormField> = (values) => {
    const mutation = defaultData === true ? createField : updateField;

    mutation.mutateAsync({
      ...(defaultData !== true && { _id: defaultData._id }),
      ...values,
    }).then((res) => {
      const prevData = queryClient.getQueryData(queryKey) as ICustomFormField[];
      const valuesToUpdate = {
        ...res,
      };
      queryClient.setQueryData(
        queryKey,
        defaultData === true ? [valuesToUpdate, ...prevData] : prevData.map(item => item._id === res._id ? valuesToUpdate : item),
      );
      onClose();
    });
  };

  return (
    <Dialog
      onClose={onClose}
      mobileFullscreen
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Input
            theme="gray"
            label={`${t('customForms.names')} (sk)`}
            error={!!errors.names?.sk}
            {...register('names.sk', { required: true })}
          />
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button
          onClick={handleSubmit(submitHandler)}
          disabled={!isEmpty(errors)}
          variant="contained"
        >
          {t('approve')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(FieldDialog);
