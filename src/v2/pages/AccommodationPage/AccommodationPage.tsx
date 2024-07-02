import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import { Tab, TabPanel, Tabs, TabsContainer } from 'v2/uikit/Tabs';

import { useAuthData } from 'contexts/AuthContext';

import AccommodationProvider, { useActiveAccommodation } from './contexts/AccommodationContext';
import ResidenceProvider, { useActiveResidence } from './contexts/ResidenceContext';
import AccommodationDialog from './dialogs/AccommodationDialog';
import CheckoutDialog from './dialogs/CheckoutDialog';
import ResidenceDialog from './dialogs/ResidenceDialog';
import AccommodationObjects from './AccommodationObjects';
import ProjectAccommodations from './ProjectAccommodations';
import Residences from './Residences';
import { PageWrapper } from './styles';

const AccommodationPageRender = () => {
  const { t } = useTranslation();

  const [openAccommodation, setOpenAccommodation] = useActiveAccommodation();
  const [openResidence, setOpenResidence] = useActiveResidence();
  const [openCheckout, setOpenCheckout] = useState(false);
  useDocumentTitle(t('navbar.accommodation'));

  const { permissions } = useAuthData();

  return (
    <PageWrapper>
      <TabsContainer defaultTab={permissions.includes('residences:read') ? 0 : 1}>
        <Tabs>
          <Tab label={t('accommodation.residences')} disabled={!permissions.includes('residences:read')} />
          <Tab label={t('accommodation.objects')} />
          <Tab label={t('accommodation.projectAccommodations')} />
        </Tabs>
        <TabPanel index={0}>
          <Residences />
        </TabPanel>
        <TabPanel index={1} hiddenRender={false}>
          <AccommodationObjects />
        </TabPanel>
        <TabPanel index={2} hiddenRender={false}>
          <ProjectAccommodations />
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
