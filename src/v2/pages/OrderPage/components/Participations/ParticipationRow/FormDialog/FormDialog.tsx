import React, { memo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import pick from 'lodash-es/pick';
import OrderParticipationForm from 'v2/components/OrderParticipationForm';
import { Button } from 'v2/uikit';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';

import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import { FormWrapper } from './styles';

type Props = DialogProps & {
  participation: IOrderParticipation<true>;
  onSubmit(values: Partial<IOrderParticipation>): void;
}

const FormDialog = ({ onSubmit, participation, ...rest }: Props) => {
  const formMethods = useForm<IOrderParticipation<true>>({ defaultValues: participation });
  const { t } = useTranslation();
  return (
    <Dialog {...rest} title={participation.user.fullname} mobileFullscreen>
      <FormWrapper>
        <FormProvider {...formMethods}>
          <OrderParticipationForm />
        </FormProvider>
      </FormWrapper>
      <DialogActions>
        <Button
          onClick={formMethods.handleSubmit((values) => {
            onSubmit?.(pick(values, ['stages', 'comment', 'screaning']));
            rest.onClose();
          })}
          variant="contained"
        >
          {t('approve')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(FormDialog);
