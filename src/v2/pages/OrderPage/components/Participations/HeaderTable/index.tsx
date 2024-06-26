import React, { Dispatch, memo, SetStateAction, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileFormDialog from 'v2/components/ProfileFormDialog';
import useOrderParticipationActions from 'v2/pages/OrderPage/hooks/useOrderParticipationActions';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import Dialog, { DialogActions } from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { useCreateUserMutation } from 'api/mutations/userMutation';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { ArrowDownIcon, PlusIcon, ThreeDotsIcon } from 'components/icons';
import { DEFAULT_PASS } from 'constants/user';
import { useAuthData } from 'contexts/AuthContext';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';
import { IUser } from 'interfaces/users.interface';

type Props = {
  participations: IOrderParticipation<true>[];
  setSelectedItems: Dispatch<SetStateAction<IOrderParticipation<true>[]>>;
  selectedItems: IOrderParticipation<true>[];
  setOpenPrintDialog: Dispatch<SetStateAction<boolean>>;
};

const HeaderTable = ({ participations, selectedItems, setSelectedItems, setOpenPrintDialog }: Props) => {
  const { t } = useTranslation();

  // create new participation
  const [openCreateParticipationDialog, setOpenCreateParticipationDialog] = useState(false);
  const { data: users = [] } = useGetUserListForFilter();
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const { create: createParticipation } = useOrderParticipationActions();
  const availableUsers = useMemo(
    () => users.filter((user) => !participations.some(participation => participation.user._id === user._id)),
    [participations, users],
  );

  // create new user and add it to order
  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);
  const createUserMutation = useCreateUserMutation();

  const createNewUserHandler = async (data: Partial<IUser>) => {
    setOpenCreateUserDialog(false);
    const recruiter = data.recruiter as IUser | null;
    const values = { ...data, recruiter: recruiter?._id || null, password: DEFAULT_PASS, status: 'candidate' };
    const createdUser = await createUserMutation.mutateAsync(values);
    await createParticipation(createdUser._id);
  };

  const { permissions } = useAuthData();

  return (
    <>
      <ListTableHeader title={`${t('order.participations')}: ${participations.length}`}>
        <IconButton className="small-btn primary" onClick={() => void setOpenCreateParticipationDialog(true)}><PlusIcon size={25} /></IconButton>
        <Menu
          menuComponent={(
            <>
              <Button className="big-btn">
                <div className="text">{t('fastActions')}</div>
                <ArrowDownIcon className="big-icon" />
              </Button>
              <IconButton className="small-btn primary"><ThreeDotsIcon size={25} /></IconButton>
            </>
          )}
        >
          {permissions.includes('orders:update') && (
            <>
              <MenuItem onClick={() => void setOpenCreateParticipationDialog(true)}>
                {t('order.addNewParticipation')}
              </MenuItem>
              <MenuItem onClick={() => void setOpenCreateUserDialog(true)}>
                {t('user.new')}
              </MenuItem>
              <Divider />
            </>
          )}
          <MenuItem onClick={() => void setSelectedItems(participations)}>
            {t('selectAll')}
          </MenuItem>
          <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
            {t('removeSelect')}
          </MenuItem>
          <MenuItem disabled={!selectedItems.length} onClick={() => void setOpenPrintDialog(true)}>
            {t('docsTemplates.print')}
          </MenuItem>
        </Menu>
      </ListTableHeader>
      {!!openCreateParticipationDialog && (
        <Dialog
          onClose={() => { setOpenCreateParticipationDialog(false); setSelectedUsers([]); } }
          open={openCreateParticipationDialog}
          title={t('order.addNewParticipation')}
        >
          <div style={{ width: 300 }}>
            <Autocomplete
              multiple
              limitTags={10}
              options={availableUsers}
              label={t('profile')}
              theme="gray"
              labelKey="fullname"
              style={{ marginBottom: 12 }}
              value={selectedUsers}
              onChange={(v) => void setSelectedUsers(v)}
            />
          </div>
          <DialogActions>
            <Button
              variant="contained"
              disabled={!selectedUsers.length}
              onClick={async () => {
                if (selectedUsers) {
                  setOpenCreateParticipationDialog(false);
                  setSelectedUsers([]);
                  await Promise.all(selectedUsers.map((user) => createParticipation(user._id)));
                }
              }}
            >{t('approve')}</Button>
          </DialogActions>
        </Dialog>
      )}
      {!!openCreateUserDialog && (
        <ProfileFormDialog
          open={openCreateUserDialog}
          onClose={() => void setOpenCreateUserDialog(false)}
          onSave={createNewUserHandler}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
