import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTableColumns } from 'v2/contexts/TableColumnsContext';
import { getCurrencyString } from 'v2/helpers/currency';

import { useGetProjectAccommodations } from 'api/query/projectAccommodationsQuery';
import { getDateFromIso } from 'helpers/datetime';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IResidence } from 'interfaces/residence.interface';

import useResidenceDaysDiff from './useResidenceDaysDiff';

export type TableColumnKey ='adress'
|'name'
|'costNight'
|'costMonth'
|'checkIn'
|'checkOut'
|'days'
|'sum'
|'client'
|'userStatus'
|'userCooperationStartDate'
|'userCooperationEndDate'
|'userCooperationType'
|'project'
|'createdBy'
|'updatedBy'
|'createdAt'
|'updatedAt'
|'damageCompencationPrice'
|'reinvoicingPrice'
|'userFullname'

const useGetTableCellContent = () => {
  const { t } = useTranslation();
  const getDaysDiff = useResidenceDaysDiff();
  const [activeCols] = useTableColumns();
  const { data: projectAccommodations = [] } = useGetProjectAccommodations(
    {},
    { enabled: activeCols.includes('accommodation.damageCompencationPrice') || activeCols.includes('accommodation.reinvoicingPrice') },
  );

  const generateCellContent = useCallback((row: IResidence, key: TableColumnKey) => {
    if (key === 'adress') {
      const accommodation = (row.accommodation as IAccommodation);
      return accommodation[key];
    }
    if (key === 'name') {
      const accommodation = (row.accommodation as IAccommodation);
      return accommodation.name || accommodation.owner;
    }
    if (key === 'costNight' || key === 'costMonth') {
      const accommodation = (row.accommodation as IAccommodation);
      return getCurrencyString(accommodation[key]);
    }
    if (key === 'damageCompencationPrice' || key === 'reinvoicingPrice') {
      const projectAccommodation = projectAccommodations.find(
        (projectAccommodationItem) => (
          projectAccommodationItem.accommodation._id === (row.accommodation as IAccommodation)._id &&
            projectAccommodationItem.project._id === (row.project as IProject)?._id
        ),
      );
      if (!projectAccommodation) return null;
      let dailyValue = Number(projectAccommodation[key]);
      if (projectAccommodation[key.replace('Price', 'Tariff') as keyof typeof projectAccommodation] === 'month') {
        dailyValue = dailyValue / 30;
      }
      return getCurrencyString(dailyValue * (getDaysDiff(row) || 0));
    }
    if (key === 'checkIn' || key === 'checkOut') {
      const residenceKey = `${key}Date` as keyof IResidence;
      return getDateFromIso(row[residenceKey]);
    }
    if (key === 'days') {
      return getDaysDiff(row);
    }
    if (key === 'sum') {
      const sum = (getDaysDiff(row) || 0) * Number((row.accommodation as IAccommodation).costNight);
      return getCurrencyString(sum);
    }
    if (key === 'client') {
      return (row.client as IClient)?.shortName;
    }
    if (key === 'userStatus') {
      return t(`selects.userStatus.${row.userStatus}`);
    }
    if (key === 'userCooperationStartDate' || key === 'userCooperationEndDate') {
      return getDateFromIso(row[key]);
    }
    if (key === 'userCooperationType') {
      return row.userWorkTypes.map((wT) => t(`selects.userWorkType.${wT}`)).join(', ');
    }
    if (key === 'project') {
      return (row.project as IProject)?.name;
    }
    if (key === 'createdBy' || key === 'updatedBy') {
      return row[key]?.fullname;
    }
    if (key === 'createdAt' || key === 'updatedAt') {
      return getDateFromIso(row[key], 'dd.MM.yyyy HH:mm');
    }

    return row[key as keyof typeof row] as string;
  }, [getDaysDiff, projectAccommodations, t]);

  return generateCellContent;
};

export default useGetTableCellContent;
