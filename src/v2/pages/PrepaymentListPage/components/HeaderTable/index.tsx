import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import cloneDeep from 'lodash-es/cloneDeep';
import { useTableSelectedItems } from 'v2/contexts/TableSelectedItemsContext';
import { getCurrencyString } from 'v2/helpers/currency';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { useCreatePrepaymentMutation } from 'api/mutations/prepaymentMutation';
import { ArrowDownIcon, CheckAllIcon, ExcelIcon, PlusIcon, RemoveCheckIcon, ThreeDotsIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import { useExportData } from 'hooks/useExportData';
import { AnyObject } from 'interfaces/base.types';
import { IClient } from 'interfaces/client.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import PrepaymentDialog from '../PrepaymentDialog';

type Props = {
  data: IPrepayment[];
  activeCols: string[];
}

const HeaderTable = ({ data, activeCols }: Props) => {
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

  // select items
  const [selectedItems,, setSelectedItems] = useTableSelectedItems<IPrepayment>();

  // export
  const colsToExport = useMemo(() => activeCols.map((col: string) => col.replace('prepayment.', '')), [activeCols]);

  const prepaymentsToExport = useMemo(() => selectedItems.map((prepayment) => {
    const rowData: AnyObject = cloneDeep(prepayment);

    rowData.user = (prepayment.user as IUser)?.fullname;
    rowData.project = (prepayment.project as IProject)?.name;
    rowData.client = (prepayment.client as IClient)?.shortName;
    rowData.userStatus = t(`selects.userStatus.${prepayment.userStatus}`);
    rowData.period = getDateFromIso(prepayment.paymentDate, 'MM/yyyy');
    rowData.sum = getCurrencyString(prepayment.sum);
    rowData.comment = prepayment.adminComment;
    rowData.status = t(`selects.prepaymentStatus.${prepayment.status}`);
    rowData.paymentDate = getDateFromIso(prepayment.paymentDate);
    rowData.createdAt = getDateFromIso(prepayment.createdAt);
    rowData.createdBy = (prepayment.createdBy as IUser)?.fullname;
    rowData.updatedBy = (prepayment.updatedBy as IUser)?.fullname;

    return rowData;
  }), [selectedItems, t]);

  const exportData = useExportData({
    data: prepaymentsToExport,
    colsToExport: colsToExport,
    cols: colsToExport,
    entity: 'prepayment',
  });

  return (
    <>
      <ListTableHeader title={`${t('navbar.prepayments')}: ${data.length}`}>
        <div className="link">
          <IconButton className="small-btn primary" onClick={() => void setOpenNewPrepayment(true)}><PlusIcon size={25} /></IconButton>
          {permissions.includes('prepayments:create') && (
            <Button className="big-btn" onClick={() => void setOpenNewPrepayment(true)}>
              {t('prepayment.new')}
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
      <PrepaymentDialog
        open={openNewPrepayment}
        onClose={() => void setOpenNewPrepayment(false)}
        onSave={createNewPrepaymentHandler}
      />
    </>
  );
};

export default memo(HeaderTable);
