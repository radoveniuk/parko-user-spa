import React, { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useFilters } from 'v2/components/Filters';
import { useTableColumns } from 'v2/contexts/TableColumnsContext';
import { useTableSelectedItems } from 'v2/contexts/TableSelectedItemsContext';
import { getCurrencyString } from 'v2/helpers/currency';
import { Checkbox } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Skeleton from 'v2/uikit/Skeleton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { useDeleteResidence } from 'api/mutations/residenceMutation';
import { useGetProjectAccommodations } from 'api/query/projectAccommodationsQuery';
import { ArrowUpIcon, DeleteIcon, EditIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { iterateMap } from 'helpers/iterateMap';
import useSortedList, { SortingValue } from 'hooks/useSortedList';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IProject } from 'interfaces/project.interface';
import { IProjectAccommodation } from 'interfaces/projectAccommodation.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { useActiveResidence } from '../../contexts/ResidenceContext';
import useGetTableCellContent, { TableColumnKey } from '../hooks/useGetTableCellContent';
import useResidenceDaysDiff from '../hooks/useResidenceDaysDiff';

import { TableWrapper } from './styles';

type Props = {
  data: IResidence[];
  isFetching?: boolean;
};

const Table = ({
  data,
  isFetching,
}: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();
  const queryClient = useQueryClient();
  const { filtersState } = useFilters();

  const getDaysDiff = useResidenceDaysDiff();

  const { sortedData, sorting, sortingToggler } = useSortedList(data);
  const [activeCols] = useTableColumns();

  const { data: projectAccommodations = [] } = useGetProjectAccommodations(
    {},
    { enabled: activeCols.includes('accommodation.damageCompencationPrice') || activeCols.includes('accommodation.reinvoicingPrice') },
  );

  const toggleSorting = (residenceKey: string) => {
    let sortingPath = residenceKey as SortingValue<IResidence>;
    if (residenceKey === 'adress' || residenceKey === 'name' || residenceKey === 'costNight' || residenceKey === 'costMonth') {
      sortingPath = `accommodation.${residenceKey}`;
    }
    if (residenceKey === 'checkIn' || residenceKey === 'checkOut') {
      sortingPath = (row) => DateTime.fromISO(row[`${residenceKey}Date`]as string).toMillis();
    }
    if (residenceKey === 'createdAt' || residenceKey === 'updatedAt') {
      sortingPath = (row) => DateTime.fromISO(row[residenceKey]).toMillis();
    }
    if (residenceKey === 'days') {
      sortingPath = (row) => getDaysDiff(row);
    }
    if (residenceKey === 'name') {
      sortingPath = (row) => (row.accommodation as IAccommodation).name || (row.accommodation as IAccommodation).owner;
    }
    if (residenceKey === 'sum') {
      sortingPath = (row) => (getDaysDiff(row) || 0) * Number((row.accommodation as IAccommodation).costNight);
    }
    if (residenceKey === 'costNight') {
      sortingPath = (row) => Number((row.accommodation as IAccommodation).costNight);
    }
    if (residenceKey === 'costMonth') {
      sortingPath = (row) => Number((row.accommodation as IAccommodation).costMonth);
    }
    if (residenceKey === 'client') {
      sortingPath = 'client.shortName';
    }
    if (residenceKey === 'project') {
      sortingPath = 'project.name';
    }
    if (residenceKey === 'userCooperationType') {
      sortingPath = 'userWorkTypes';
    }
    if (residenceKey === 'createdBy' || residenceKey === 'updatedBy') {
      sortingPath = `${residenceKey}.fullname`;
    }
    sortingToggler(residenceKey, sortingPath);
  };

  const [, setOpenResidence] = useActiveResidence();
  const deleteResidence = useDeleteResidence();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const generateCellContent = useGetTableCellContent();

  const generateCellContentUI = useCallback((residence: IResidence, col: string) => {
    const column = col.replace('accommodation.', '') as TableColumnKey;
    const content = generateCellContent(residence, column);
    if (column === 'userStatus') {
      return <StatusLabel className={residence.userStatus}>{content}</StatusLabel>;
    }
    if (column === 'userFullname') {
      return <Link to={`/profile/${(residence.user as IUser)._id}`}>{content}</Link>;
    }
    return generateCellContent(residence, column);
  }, [generateCellContent]);
  // select items
  const [selectedItems, { toggle: toggleSelectedRow }] = useTableSelectedItems<IResidence>();

  const selectRowChangeHandler = useCallback((row: IResidence) => () => {
    toggleSelectedRow(row);
  }, [toggleSelectedRow]);

  // calc columns totals
  const totals = useMemo(() => {
    const days = sortedData.reduce((accumulator, currentValue) => accumulator + (getDaysDiff(currentValue) || 0), 0);
    const costNight =
      sortedData.reduce((accumulator, currentValue) => accumulator + Number((currentValue.accommodation as IAccommodation).costNight), 0);
    const costMonth =
      sortedData.reduce((accumulator, currentValue) => accumulator + Number((currentValue.accommodation as IAccommodation).costMonth), 0);
    const sum =
      // eslint-disable-next-line max-len
      sortedData.reduce((accumulator, currentValue) => accumulator + Number((getDaysDiff(currentValue) || 0) * Number((currentValue.accommodation as IAccommodation).costNight)), 0);

    const getProjectccommodationMetric = (metricName: 'reinvocing' | 'damageCompencation') => sortedData.reduce((accumulator, currentValue) => {
      const priceKey = `${metricName}Price` as keyof IProjectAccommodation;
      const tariffKey = `${metricName}Tariff` as keyof IProjectAccommodation;
      const projectAccommodation = projectAccommodations.find(
        (projectAccommodationItem) => (
          projectAccommodationItem.accommodation._id === (currentValue.accommodation as IAccommodation)._id &&
              projectAccommodationItem.project._id === (currentValue.project as IProject)?._id
        ),
      );
      const days = getDaysDiff(currentValue) || 0;

      if (!projectAccommodation) return accumulator;
      let dailyValue = Number(projectAccommodation[priceKey]);
      if (projectAccommodation[tariffKey] === 'month') {
        dailyValue = dailyValue / 30;
      }
      return accumulator + (days * dailyValue);
    }, 0);

    return {
      days: days,
      costNight: getCurrencyString(costNight),
      costMonth: getCurrencyString(costMonth),
      sum: getCurrencyString(sum),
      reinvoicingPrice: getCurrencyString(getProjectccommodationMetric('reinvocing')),
      damageCompencationPrice: getCurrencyString(getProjectccommodationMetric('damageCompencation')),
    } as Record<string, number | string>;
  }, [getDaysDiff, projectAccommodations, sortedData]);

  return (
    <TableWrapper>
      <ListTable
        columns={['', ...activeCols, '']}
        className="residences-table"
        columnComponent={(col) => {
          if (col) {
            const keyCol = col.replace('accommodation.', '');
            return (
              <div
                role="button"
                className="col-item"
                onClick={() => void toggleSorting(keyCol)}
              >
                {t(col)} {keyCol in totals ? `(${totals[keyCol]})` : ''}
                <IconButton
                  className={
                    sorting?.key === (keyCol)
                      ? `sort-btn active ${sorting.dir}`
                      : 'sort-btn'
                  }
                >
                  <ArrowUpIcon />
                </IconButton>
              </div>
            );
          }
        }}
      >
        {sortedData.map((item: IResidence) => (
          <ListTableRow key={item._id}>
            <ListTableCell>
              <Checkbox
                checked={selectedItems.some((selectedItem) => selectedItem._id === item._id)}
                onChange={selectRowChangeHandler(item)}
              />
            </ListTableCell>
            {activeCols.map((col) => (
              <ListTableCell key={col}>
                {generateCellContentUI(item, col)}
              </ListTableCell>
            ))}
            <ListTableCell align="right">
              {permissions.includes('residences:update') && (
                <IconButton onClick={() => void setOpenResidence(item)}><EditIcon /></IconButton>
              )}
              {permissions.includes('residences:delete') && (
                <IconButton onClick={() => void setIdToDelete(item._id)}><DeleteIcon /></IconButton>
              )}
            </ListTableCell>
          </ListTableRow>
        ))}
        {!sortedData.length && isFetching && (
          iterateMap(20, (index) => (
            <ListTableRow key={index}>
              {activeCols.map((emptyCol, emptyColIndex) => (
                <ListTableCell key={emptyCol + emptyColIndex}><Skeleton /></ListTableCell>
              ))}
            </ListTableRow>
          ))
        )}
      </ListTable>
      <DialogConfirm
        onClose={() => void setIdToDelete(null)}
        open={!!idToDelete}
        onSubmit={() => {
          const prevAccommodations = queryClient.getQueryData(['residences', JSON.stringify(filtersState)]) as IResidence[];
          queryClient.setQueryData(['residences', JSON.stringify(filtersState)], prevAccommodations.filter((item) => item._id !== idToDelete));
          setIdToDelete(null);
          deleteResidence.mutate(idToDelete as string);
        }}
      />
    </TableWrapper>
  );
};

export default memo(Table);
