import React, { memo } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CustomForm from 'v2/components/CustomForm';
import { Button } from 'v2/uikit';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';

import { SaveIcon } from 'components/icons';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

type Props = DialogProps & {
  participation: IOrderParticipation<true>;
  onSubmit(values: Record<string, any>): void;
};

const ScreaningDialog = ({ participation, onSubmit, ...rest }: Props) => {
  const { t } = useTranslation();
  const formMethods = useForm({ defaultValues: participation.screaning });

  const submitHandler: SubmitHandler<Record<string, any>> = (values) => {
    rest.onClose();
    onSubmit(values);
  };

  if (!participation.order.form) {
    return null;
  }

  return (
    <Dialog title={`${t('order.screaning')} - ${participation.user.fullname}`} mobileFullscreen {...rest}>
      <FormProvider {...formMethods}>
        {participation.order.form && <CustomForm form={participation.order.form} />}
      </FormProvider>
      <DialogActions>
        <Button
          onClick={() => {
            const values = formMethods.getValues();
            onSubmit(values);
            rest.onClose();
          }}
          variant="outlined"
        >
          <SaveIcon />
          {t('save')}
        </Button>
        <Button onClick={formMethods.handleSubmit(submitHandler)} variant="contained">{t('approve')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ScreaningDialog);
