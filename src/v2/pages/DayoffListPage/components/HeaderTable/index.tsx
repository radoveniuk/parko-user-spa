import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Button, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { useCreateDayoffMutation } from 'api/mutations/dayoffMutation';
import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IUser } from 'interfaces/users.interface';

import DayoffDialog from '../DayoffDialog';

import { HeaderWrapper } from './styles';

type Props = {
  data: IDayOff[];
}

const HeaderTable = ({ data }: Props) => {
  const { t } = useTranslation();
  const { role } = useAuthData();

  const [openNewDayoff, setOpenNewDayoff] = useState(false);
  const createDayoffMutation = useCreateDayoffMutation();
  const queryClient = useQueryClient();

  const createNewDayoffHandler = (values: Partial<IDayOff>) => {
    setOpenNewDayoff(false);
    const queryKey = ['daysoff', JSON.stringify({})];
    const users: IUser[] = queryClient.getQueryData(['users-filter', JSON.stringify({})]) || [];
    queryClient.setQueryData(
      queryKey, [{ ...values, user: users.find((user) => user._id === values.user), _id: createId() },
        ...(queryClient.getQueryData(queryKey) as IDayOff[])],
    );
    createDayoffMutation.mutateAsync(values).then((res) => {
      const [, ...oldItems] = queryClient.getQueryData(queryKey) as IDayOff[];
      queryClient.setQueryData(queryKey, [res, ...oldItems]);
    });
  };

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('navbar.daysoff')}: {data.length}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <div className="link">
            <IconButton className="small-btn primary" onClick={() => void setOpenNewDayoff(true)}><PlusIcon size={25} /></IconButton>
            {role === 'admin' && (
              <Button className="big-btn" onClick={() => void setOpenNewDayoff(true)}>
                {t('dayoff.new')}
              </Button>
            )}
          </div>
        </Stack>
      </HeaderWrapper>
      {openNewDayoff && (
        <DayoffDialog
          open={openNewDayoff}
          onClose={() => void setOpenNewDayoff(false)}
          onSave={createNewDayoffHandler}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
