import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';
import { Tab, TabPanel, Tabs, TabsContainer } from 'v2/uikit/Tabs';

import { CopyIcon } from 'components/icons';
import { EXPORT_USER_DOC_FIELDS, EXPORT_USER_EMPLOYMENT_FIELDS, EXPORT_USER_FIELDS } from 'constants/userCsv';

import { FieldCodesGrid } from './styles';

export const FieldsDialog = ({ ...rest }: DialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog {...rest} maxWidth={false} mobileFullscreen>
      <TabsContainer>
        <Tabs>
          <Tab label={t('profile')} />
          <Tab label={t('user.docsFields')} />
          <Tab label={t('user.cooperation')} />
        </Tabs>
        <TabPanel index={0}>
          <FieldCodesGrid>
            {EXPORT_USER_FIELDS.map((field) => (
              <div className="code" key={field}>
                <div className="name">
                  {t(`user.${field}`)}
                  <IconButton
                    onClick={() => void navigator.clipboard.writeText(`{${field}}`)}
                  >
                    <CopyIcon size={14} />
                  </IconButton>
                </div>
                <div className="value">
                  &#123;{field}&#125;
                </div>
              </div>
            ))}
          </FieldCodesGrid>
        </TabPanel>
        <TabPanel index={1}>
          <FieldCodesGrid>
            {EXPORT_USER_DOC_FIELDS.map((field) => (
              <div className="code" key={field}>
                <div className="name">
                  {t(`user.${field}`)}
                  <IconButton
                    onClick={() => void navigator.clipboard.writeText(`{${field.replace('.', '_')}}`)}
                  >
                    <CopyIcon size={14} />
                  </IconButton>
                </div>
                <div className="value">
                  &#123;{field.replace('.', '_')}&#125;
                </div>
              </div>
            ))}
          </FieldCodesGrid>
        </TabPanel>
        <TabPanel index={2}>
          <FieldCodesGrid>
            {EXPORT_USER_EMPLOYMENT_FIELDS.map((field) => (
              <div className="code" key={field}>
                <div className="name">
                  {t(`employment.${field}`)}
                  <IconButton
                    onClick={() => void navigator.clipboard.writeText(`{employment_${field}}`)}
                  >
                    <CopyIcon size={14} />
                  </IconButton>
                </div>
                <div className="value">
                  &#123;employment_{field}&#125;
                </div>
              </div>
            ))}
          </FieldCodesGrid>
        </TabPanel>
      </TabsContainer>
    </Dialog>
  );
};
