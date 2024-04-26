import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Button } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { useCreateDayoffMutation } from 'api/mutations/dayoffMutation';
import { PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IUser } from 'interfaces/users.interface';

import DayoffDialog from '../DayoffDialog';

type Props = {
  data: IDayOff[];
}

const HeaderTable = ({ data }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

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
      <ListTableHeader title={`${t('navbar.daysoff')}: ${data.length}`}>
        <div className="link">
          <IconButton className="small-btn primary" onClick={() => void setOpenNewDayoff(true)}><PlusIcon size={25} /></IconButton>
          {permissions.includes('daysoff:create') && (
            <Button className="big-btn" onClick={() => void setOpenNewDayoff(true)}>
              {t('dayoff.new')}
            </Button>
          )}
        </div>
      </ListTableHeader>
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
