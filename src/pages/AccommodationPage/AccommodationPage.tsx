import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CheckInIcon, CheckOutIcon, PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Page, { PageActions, PageTitle } from 'components/shared/Page';
import { Tab, TabPanel, Tabs, TabsContainer } from 'components/shared/Tabs';

import AccommodationProvider, { useActiveAccommodation } from './contexts/AccommodationContext';
import ResidenceProvider, { useActiveResidence } from './contexts/ResidenceContext';
import AccommodationDialog from './dialogs/AccommodationDialog';
import CheckoutDialog from './dialogs/CheckoutDialog';
import ResidenceDialog from './dialogs/ResidenceDialog';
import Accommodations from './Accommodations';
import Residences from './Residences';

const AccommodationPageRender = () => {
  const { t } = useTranslation();

  const [openAccommodation, setOpenAccommodation] = useActiveAccommodation();
  const [openResidence, setOpenResidence] = useActiveResidence();
  const [openCheckout, setOpenCheckout] = useState(false);

  return (
    <Page title={t('navbar.accommodation')}>
      <PageTitle>{t('navbar.accommodation')}</PageTitle>
      <PageActions>
        <Button color="secondary" onClick={() => void setOpenAccommodation(true)}><PlusIcon size={20}/>{t('accommodation.create')}</Button>
        <Button color="secondary" variant="outlined" onClick={() => void setOpenResidence(true)}><CheckInIcon size={20}/>CheckIn</Button>
        <Button color="secondary" variant="outlined" onClick={() => void setOpenCheckout(true)}><CheckOutIcon size={20}/>CheckOut</Button>
      </PageActions>
      <TabsContainer>
        <Tabs>
          <Tab label={t('accommodation.residences')} />
          <Tab label={t('accommodation.objects')} />
        </Tabs>
        <TabPanel index={0}>
          <Residences />
        </TabPanel>
        <TabPanel index={1}>
          <Accommodations />
        </TabPanel>
      </TabsContainer>
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
      {openCheckout && (
        <CheckoutDialog
          open={!!openCheckout}
          onClose={() => void setOpenCheckout(false)}
        />
      )}
    </Page>
  );
};

export default function AccommodationPage () {
  return (
    <AccommodationProvider>
      <ResidenceProvider>
        <AccommodationPageRender />
      </ResidenceProvider>
    </AccommodationProvider>
  );
}
