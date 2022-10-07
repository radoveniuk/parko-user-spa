import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { useDeleteResidence } from 'api/mutations/residenceMutation';
import { useGetResidenceFilterLists, useGetResidences } from 'api/query/residenceQuery';
import { CloseIcon, EditIcon } from 'components/icons';
import DialogConfirm from 'components/shared/DialogConfirm';
import { FiltersBar, FiltersProvider, useFilters } from 'components/shared/Filters';
import { ClearFiLtersButton, FilterAutocomplete, FilterDate, FilterSelect, FilterText } from 'components/shared/Filters/Filters';
import IconButton from 'components/shared/IconButton';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { getDateFromIso } from 'helpers/datetime';
import useDebounce from 'hooks/useDebounce';
import usePrev from 'hooks/usePrev';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IProject } from 'interfaces/project.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { useActiveAccommodation } from '../contexts/AccommodationContext';
import { useActiveResidence } from '../contexts/ResidenceContext';

import { ResidencesWrapper } from './styles';

const COLUMNS = [
  'user.name',
  'user.project',
  'accommodation.owner',
  'accommodation.adress',
  'accommodation.checkIn',
  'accommodation.checkOut',
  'accommodation.days',
  'accommodation.costNight',
  'accommodation.sum',
  '',
  '',
];

type ResidenceTableRow = {
  _id: string;
  user: string;
  project: string;
  owner: string;
  adress: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  days: number;
  costNight: string;
  sum: number;
  metadata: IResidence;
};

const getDays = (residence: IResidence) => {
  if (!residence.checkInDate) return null;

  const checkIn = DateTime.fromISO(residence.checkInDate);

  if (residence.checkOutDate) {
    const checkOut = DateTime.fromISO(residence.checkOutDate);
    const diff = -checkIn.diff(checkOut, 'days').days.toFixed();
    return diff > 0 ? diff : 0;
  }

  const diff = -checkIn.diffNow('days').days.toFixed();
  return diff > 0 ? diff : 0;
};

const Residences = () => {
  const { t } = useTranslation();
  const { filtersState } = useFilters();
  const debouncedFiltersState = useDebounce(filtersState);
  const activeOptions = useTranslatedSelect(['true', 'false']);
  const { data: filters, refetch: refetchFilters } = useGetResidenceFilterLists();

  const { data: residences = [], refetch, remove } = useGetResidences(debouncedFiltersState, { enabled: false });
  const tableData: ResidenceTableRow[] = useMemo(() => residences.map((item) => {
    const { name, surname, project } = item.user as IUser;
    const { owner, adress, costNight } = item.accommodation as IAccommodation;
    const days = getDays(item) || 0;
    return {
      _id: item._id,
      user: `${name} ${surname}`,
      project: (project as IProject)?.name,
      owner,
      adress,
      checkInDate: getDateFromIso(item.checkInDate),
      checkOutDate: getDateFromIso(item.checkOutDate),
      days,
      costNight,
      sum: days * Number(costNight),
      metadata: item,
    };
  }), [residences]);

  const [openResidence, setOpenResidence] = useActiveResidence();
  const [openAccomodation, setOpenAccommodation] = useActiveAccommodation();

  const deleteResidence = useDeleteResidence();
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const prevResidence = usePrev(openResidence);
  const prevAccommodation = usePrev(openAccomodation);
  useEffect(() => {
    if ((!!prevResidence && !openResidence) || (!!prevAccommodation && !openAccomodation)) {
      refetch();
      refetchFilters();
    }
  }, [openAccomodation, openResidence, prevAccommodation, prevResidence, refetch, refetchFilters]);

  useEffect(() => {
    if (debouncedFiltersState) {
      refetch();
    }
    return () => void remove;
  }, [debouncedFiltersState, refetch, remove]);

  return (
    <ResidencesWrapper>
      <FiltersBar>
        <FilterDate label={t('firstDate')} filterKey="firstDate" />
        <FilterDate label={t('lastDate')} filterKey="lastDate" />
        <FilterSelect filterKey="active" label={t('accommodation.active')} options={activeOptions} emptyItem={t('selectAll')} />
        {filters?.users && (
          <FilterAutocomplete
            filterKey="user"
            label={t('navbar.profiles')}
            options={filters.users}
            getOptionLabel={(option) => `${option.name} ${option.surname} ${option.project ? `(${option.project.name})` : ''}`}
          />
        )}
        {filters?.projects && (
          <FilterAutocomplete
            filterKey="project"
            label={t('user.project')}
            options={filters.projects}
            labelKey="name"
          />
        )}
        <FilterText filterKey="accommodationOwner" label={t('accommodation.owner')} />
        <FilterText filterKey="accommodationAdress" label={t('accommodation.adress')} />
        <ClearFiLtersButton />
      </FiltersBar>
      <ListTable columns={COLUMNS} >
        {tableData.map((item) => (
          <ListTableRow key={item._id}>
            <ListTableCell>
              <Link to={`/profile/${(item.metadata.user as IUser)._id}`} className="table-link">{item.user}</Link>
            </ListTableCell>
            <ListTableCell>
              <Link to={`/projects?id=${((item.metadata.user as IUser).project as IProject)?._id}`} className="table-link">{item.project}</Link>
            </ListTableCell>
            <ListTableCell>{item.owner}</ListTableCell>
            <ListTableCell>
              <div
                role="button"
                className="table-link"
                onClick={() => void setOpenAccommodation(item.metadata.accommodation as IAccommodation)}
              >
                {item.adress}
              </div>
            </ListTableCell>
            <ListTableCell>{item.checkInDate}</ListTableCell>
            <ListTableCell>{item.checkOutDate}</ListTableCell>
            <ListTableCell>{item.days}</ListTableCell>
            <ListTableCell>{item.costNight}</ListTableCell>
            <ListTableCell>{item.sum}</ListTableCell>
            <ListTableCell><IconButton onClick={() => void setOpenResidence(item.metadata)}><EditIcon /></IconButton></ListTableCell>
            <ListTableCell><IconButton onClick={() => void setIdToDelete(item._id)}><CloseIcon /></IconButton></ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
      <DialogConfirm
        onClose={() => void setIdToDelete(null)}
        open={!!idToDelete}
        onSubmit={() => {
          deleteResidence.mutateAsync(idToDelete as string).then(() => {
            setIdToDelete(null);
            refetch();
          });
        }}
      />
    </ResidencesWrapper>
  );
};

export default function ResidencesWithFilters () {
  return (
    <FiltersProvider>
      <Residences />
    </FiltersProvider>
  );
};