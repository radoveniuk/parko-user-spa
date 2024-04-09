import React, { Dispatch, memo, SetStateAction, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useOrderParticipationActions from 'v2/pages/OrderPage/hooks/useOrderParticipationActions';
import { Button, Menu, MenuItem, Stack } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import Dialog, { DialogActions } from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';

import { useGetUserListForFilter } from 'api/query/userQuery';
import { ArrowDownIcon, PlusIcon, ThreeDotsIcon } from 'components/icons';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';
import { IUser } from 'interfaces/users.interface';

import { HeaderWrapper } from './styles';

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
        </Stack>
      </HeaderWrapper>
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
              getOptionLabel={(item) => `${item.name} ${item.surname}`}
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
    </>
  );
};

export default memo(HeaderTable);
