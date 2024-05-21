import React, { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash-es/isEqual';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from 'v2/uikit/Table';

import { BoxIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import useListState from 'hooks/useListState';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

import { ActionsCell } from './styles';

type Props = {
  data: IPropertyMovement<true>[];
};

const PropertyMovementsFormCard = ({ data }: Props) => {
  const { t } = useTranslation();
  const [movements,, setMovements] = useListState(data);

  useEffect(() => {
    if (!isEqual(data, movements)) {
      setMovements(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setMovements]);

  return (
    <>
      <FormCard>
        <FormCardHeader icon={<BoxIcon size={18} />} title={t('user.propertyMovements')} />
        <FormCardBody>
          {!!movements.length && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('stock.property')}, {t('stock.count').toLowerCase()}</TableCell>
                    <TableCell>{t('stock.movementType')}</TableCell>
                    <TableCell>{t('stock.date')}</TableCell>
                    <TableCell>{t('stock.createdAt')}</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement._id}>
                      <TableCell>{movement.property.internalName}, {movement.count}</TableCell>
                      <TableCell>{t(`selects.propertyMovementType.${movement.type}`)}</TableCell>
                      <TableCell>{getDateFromIso(movement.date)}</TableCell>
                      <TableCell>{getDateFromIso(movement.createdAt, 'dd.MM.yyyy HH:mm')}</TableCell>
                      <TableCell>
                        <ActionsCell>
                        </ActionsCell>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </FormCardBody>
      </FormCard>
    </>
  );
};

export default memo(PropertyMovementsFormCard);
