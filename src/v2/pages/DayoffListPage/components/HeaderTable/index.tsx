import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import cloneDeep from 'lodash-es/cloneDeep';
import { useTableSelectedItems } from 'v2/contexts/TableSelectedItemsContext';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { useCreateDayoffMutation } from 'api/mutations/dayoffMutation';
import { ArrowDownIcon, CheckAllIcon, ExcelIcon, PlusIcon, RemoveCheckIcon, ThreeDotsIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
import { AnyObject } from 'interfaces/base.types';
import { IClient } from 'interfaces/client.interface';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IFile } from 'interfaces/file.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { getDayoffStatus } from '../../helpers/status';
import DayoffDialog from '../DayoffDialog';

type Props = {
  data: IDayOff[];
  activeCols: string[];
}

const HeaderTable = ({ data, activeCols }: Props) => {
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

  // select items
  const [selectedItems,, setSelectedItems] = useTableSelectedItems<IDayOff>();

  // export
  const colsToExport = useMemo(() => activeCols.map((col: string) => col.replace('dayoff.', '')), [activeCols]);

  const daysoffToExport = useMemo(() => selectedItems.map((dayoff) => {
    const rowData: AnyObject = cloneDeep(dayoff);

    rowData.user = (dayoff.user as IUser)?.fullname;
    rowData.project = (dayoff.project as IProject)?.name;
    rowData.client = (dayoff.client as IClient)?.shortName;
    rowData.userStatus = t(`selects.userStatus.${dayoff.userStatus}`);
    rowData.status = t(`selects.dayoffStatus.${getDayoffStatus(dayoff.dateStart, dayoff.dateEnd)}`);
    rowData.reason = t(`selects.dayoffReason.${(dayoff.reason)}`);
    rowData.dateStart = getDateFromIso(dayoff.dateStart);
    rowData.docs = dayoff.docs?.map((docItem) => {
      const doc = docItem as IFile;
      return `${doc.originalname}.${doc.ext}`;
    }).join(', ');
    rowData.dateEnd = getDateFromIso(dayoff.dateEnd);
    rowData.createdAt = getDateFromIso(dayoff.createdAt);
    rowData.createdBy = (dayoff.createdBy as IUser)?.fullname;
    rowData.updatedBy = (dayoff.updatedBy as IUser)?.fullname;

    return rowData;
  }), [selectedItems, t]);

  const exportData = useExportData({
    data: daysoffToExport,
    colsToExport: colsToExport,
    cols: colsToExport,
    entity: 'dayoff',
  });

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
            <MenuItem onClick={() => void setSelectedItems(data)}>
              <CheckAllIcon size={20} />
              {t('selectAll')}
            </MenuItem>
            <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
              <RemoveCheckIcon size={20} />
              {t('removeSelect')}
            </MenuItem>
            <Divider />
            <MenuItem color="#1e6e43" disabled={!selectedItems.length} onClick={() => void exportData('xlsx')}>
              <ExcelIcon size={20} />{t('user.export')}
            </MenuItem>
          </Menu>
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
