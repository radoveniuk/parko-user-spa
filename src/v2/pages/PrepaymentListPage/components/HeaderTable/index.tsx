import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Button, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { useCreatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IUser } from 'interfaces/users.interface';

import PrepaymentDialog from '../PrepaymentDialog';

import { HeaderWrapper } from './styles';

const HeaderTable = ({ data }: any) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [openNewPrepayment, setOpenNewPrepayment] = useState(false);
  const createPrepaymentMutation = useCreatePrepaymentMutation();
  const queryClient = useQueryClient();

  const createNewPrepaymentHandler = (values: Partial<IPrepayment>) => {
    setOpenNewPrepayment(false);
    const queryKey = ['prepayments', JSON.stringify({})];
    const users: IUser[] = queryClient.getQueryData(['users-filter', JSON.stringify({})]) || [];
    queryClient.setQueryData(
      queryKey, [
        { ...values, user: users.find((user) => user._id === values.user), _id: createId() },
        ...(queryClient.getQueryData(queryKey) as IPrepayment[]),
      ],
    );
    createPrepaymentMutation.mutateAsync(values).then((res) => {
      const [, ...oldItems] = queryClient.getQueryData(queryKey) as IPrepayment[];
      queryClient.setQueryData(queryKey, [res, ...oldItems]);
    });
  };

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('navbar.prepayments')}: {data.length}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <div className="link">
            <IconButton className="small-btn primary" onClick={() => void setOpenNewPrepayment(true)}><PlusIcon size={25} /></IconButton>
            {permissions.includes('prepayments:create') && (
              <Button className="big-btn" onClick={() => void setOpenNewPrepayment(true)}>
                {t('prepayment.new')}
              </Button>
            )}
          </div>
        </Stack>
      </HeaderWrapper>
      <PrepaymentDialog
        open={openNewPrepayment}
        onClose={() => void setOpenNewPrepayment(false)}
        onSave={createNewPrepaymentHandler}
      />
    </>
  );
};

export default memo(HeaderTable);
