import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'v2/uikit';
import Dialog from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import { Table, TableBody, TableCell, TableHead, TableRow } from 'v2/uikit/Table';

import { DayoffIcon, DeleteIcon, EditIcon, PlusIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IDayOff } from 'interfaces/dayoff.interface';

import { ActionsCell } from './styles';

type Props = {
  data: IDayOff[];
};

const DaysOffFormCard = ({ data }: Props) => {
  const { t } = useTranslation();
  const [dayoffDialogData, setDayoffDialogData] = useState<Partial<IDayOff> | null>(null);
  const [deleteDialogData, setDeleteDialogData] = useState<Partial<IDayOff> | null>(null);
  return (
    <>
      <FormCard>
        <FormCardHeader icon={<DayoffIcon size={24} />} title={t('navbar.daysoff')}>
          <Button onClick={() => void setDayoffDialogData({})}><PlusIcon />{t('add')}</Button>
        </FormCardHeader>
        <FormCardBody>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('dayoff.reason')}</TableCell>
                <TableCell>{t('dayoff.dateStart')}</TableCell>
                <TableCell>{t('dayoff.dateEnd')}</TableCell>
                <TableCell>{t('dayoff.createdAt')}</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((dayoff) => (
                <TableRow key={dayoff._id}>
                  <TableCell>{t(`selects.dayoffReason.${dayoff.reason}`)}</TableCell>
                  <TableCell>{getDateFromIso(dayoff.dateStart)}</TableCell>
                  <TableCell>{getDateFromIso(dayoff.dateEnd)}</TableCell>
                  <TableCell>{getDateFromIso(dayoff.createdAt)}</TableCell>
                  <TableCell align="right">
                    <ActionsCell>
                      <IconButton onClick={() => void setDayoffDialogData(dayoff)}>
                        <EditIcon size={15} />
                      </IconButton>
                      <IconButton onClick={() => void setDeleteDialogData(dayoff)}>
                        <DeleteIcon size={15} />
                      </IconButton>
                    </ActionsCell>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FormCardBody>
      </FormCard>
      <Dialog title={t('dayoff.dayoff')} onClose={() => void setDayoffDialogData(null)} open={dayoffDialogData !== null}>
      </Dialog>
      <DialogConfirm
        open={deleteDialogData !== null}
        onSubmit={() => undefined}
        onClose={() => void setDeleteDialogData(null)}
      />
    </>
  );
};

export default memo(DaysOffFormCard);
