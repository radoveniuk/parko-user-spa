import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import { Tab, TabPanel, Tabs, TabsContainer } from 'v2/uikit/Tabs';

import AccommodationProvider, { useActiveAccommodation } from './contexts/AccommodationContext';
import ResidenceProvider, { useActiveResidence } from './contexts/ResidenceContext';
import AccommodationDialog from './dialogs/AccommodationDialog';
import CheckoutDialog from './dialogs/CheckoutDialog';
import ResidenceDialog from './dialogs/ResidenceDialog';
import AccommodationObjects from './AccommodationObjects';
import Residences from './Residences';
import { PageWrapper } from './styles';

const AccommodationPageRender = () => {
  const { t } = useTranslation();

  const [openAccommodation, setOpenAccommodation] = useActiveAccommodation();
  const [openResidence, setOpenResidence] = useActiveResidence();
  const [openCheckout, setOpenCheckout] = useState(false);
  useDocumentTitle(t('navbar.accommodation'));

  return (
    <PageWrapper>
      <TabsContainer>
        <Tabs>
          <Tab label={t('accommodation.residences')} />
          <Tab label={t('accommodation.objects')} />
        </Tabs>
        <TabPanel index={0}>
          <Residences />
        </TabPanel>
        <TabPanel index={1} hiddenRender={false}>
          <AccommodationObjects />
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
    </PageWrapper>
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
