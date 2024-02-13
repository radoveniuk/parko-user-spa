import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import Button from 'v2/uikit/Button';
import { Tab, TabPanel, Tabs, TabsContainer } from 'v2/uikit/Tabs';

import { CheckInIcon, CheckOutIcon, ExcelIcon, PlusIcon } from 'components/icons';
import { PageActions } from 'components/shared/PageComponents';

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
  useDocumentTitle(t('navbar.accommodation'));

  return (
    <>
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
    </>
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
