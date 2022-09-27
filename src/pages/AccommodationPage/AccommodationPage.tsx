import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetResidences } from 'api/query/residenceQuery';
import { CheckInIcon, PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import { FiltersBar } from 'components/shared/Filters';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import Page, { PageActions, PageTitle } from 'components/shared/Page';
import Pagination from 'components/shared/Pagination';
import { getDateFromIso } from 'helpers/datetime';
import usePaginatedList from 'hooks/usePaginatedList';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import AccommodationDialog from './AccommodationDialog';
import ResidenceDialog from './ResidenceDialog';

const COLUMNS = [
  'user.name',
  'user.surname',
  'accommodation.owner',
  'accommodation.adress',
  'accommodation.checkIn',
  'accommodation.checkOut',
  'accommodation.cost',
];

const AccommodationPage = () => {
  const { t } = useTranslation();
  const { data: residences = [] } = useGetResidences();
  const { pageItems, paginationConfig } = usePaginatedList(residences);

  const [openAccommodation, setOpenAccommodation] = useState<boolean | IAccommodation>(false);
  const [openResidence, setOpenResidence] = useState<boolean | IResidence>(false);

  return (
    <Page title={t('navbar.accommodation')}>
      <PageTitle>{t('navbar.accommodation')}</PageTitle>
      <PageActions>
        <Button color="secondary" onClick={() => void setOpenAccommodation(true)}><PlusIcon size={20}/>{t('accommodation.create')}</Button>
        <Button color="secondary" variant="outlined" onClick={() => void setOpenResidence(true)}><CheckInIcon size={20}/>CheckIn</Button>
      </PageActions>
      <FiltersBar></FiltersBar>
      <ListTable columns={COLUMNS} >
        {pageItems.map((item) => (
          <ListTableRow key={item._id} onClick={() => void setOpenResidence(item)}>
            <ListTableCell>{(item.user as IUser).name}</ListTableCell>
            <ListTableCell>{(item.user as IUser).surname}</ListTableCell>
            <ListTableCell>{(item.accommodation as IAccommodation).owner}</ListTableCell>
            <ListTableCell>{(item.accommodation as IAccommodation).adress}</ListTableCell>
            <ListTableCell>{getDateFromIso(item.checkInDate)}</ListTableCell>
            <ListTableCell>{getDateFromIso(item.checkOutDate)}</ListTableCell>
            <ListTableCell>{(item.accommodation as IAccommodation).cost}</ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
      <Pagination {...paginationConfig} />
      {openAccommodation && (
        <AccommodationDialog
          open={!!openAccommodation}
          onClose={() => void setOpenAccommodation(false)}
          data={typeof openAccommodation === 'boolean' ? undefined : openAccommodation}
        />
      )}
      {openResidence && (
        <ResidenceDialog
          open={!!openResidence}
          onClose={() => void setOpenResidence(false)}
          data={typeof openResidence === 'boolean' ? undefined : openResidence}
        />
      )}
    </Page>
  );
};

export default AccommodationPage;
