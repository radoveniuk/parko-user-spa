import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useOrderParticipationActions from 'v2/pages/OrderPage/hooks/useOrderParticipationActions';
import { Button, Stack } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import Dialog, { DialogActions } from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';

import { useGetUserListForFilter } from 'api/query/userQuery';
import { PlusIcon } from 'components/icons';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';
import { IUser } from 'interfaces/users.interface';

import { HeaderWrapper } from './styles';

type Props = {
  participations: IOrderParticipation<true>[];
};

const HeaderTable = ({ participations }: Props) => {
  const { t } = useTranslation();

  // create new participation
  const [openCreateParticipationDialog, setOpenCreateParticipationDialog] = useState(false);
  const { data: users = [] } = useGetUserListForFilter();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { create: createParticipation } = useOrderParticipationActions();
  const availableUsers = useMemo(
    () => users.filter((user) => !participations.some(participation => participation.user._id === user._id)),
    [participations, users],
  );

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('order.participations')}: {participations.length}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <IconButton className="small-btn primary" onClick={() => void setOpenCreateParticipationDialog(true)}><PlusIcon size={25} /></IconButton>
          <Button
            className="big-btn"
            onClick={() => { setOpenCreateParticipationDialog(true); }}
          >
            <PlusIcon />{t('order.addNewParticipation')}
          </Button>
        </Stack>
      </HeaderWrapper>
      {!!openCreateParticipationDialog && (
        <Dialog
          onClose={() => { setOpenCreateParticipationDialog(false); setSelectedUser(null); } }
          open={openCreateParticipationDialog}
          title={t('order.addNewParticipation')}
        >
          <div style={{ width: 300 }}>
            <Autocomplete
              options={availableUsers}
              label={t('profile')}
              theme="gray"
              getOptionLabel={(item) => `${item.name} ${item.surname}`}
              style={{ marginBottom: 12 }}
              value={selectedUser}
              onChange={(v) => void setSelectedUser(v)}
            />
          </div>
          <DialogActions>
            <Button
              variant="contained"
              disabled={!selectedUser}
              onClick={async () => {
                if (selectedUser) {
                  setOpenCreateParticipationDialog(false);
                  setSelectedUser(null);
                  await createParticipation(selectedUser._id);
                }
              }}
            >{t('approve')}</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default memo(HeaderTable);
