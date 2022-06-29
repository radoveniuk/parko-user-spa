import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import Page, { PageTitle } from 'components/shared/Page';

import { useCSVReader } from 'react-papaparse';

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  } as CSSProperties,
  browseFile: {
    width: '20%',
  } as CSSProperties,
  acceptedFile: {
    border: '1px solid #ccc',
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '80%',
  } as CSSProperties,
  remove: {
    borderRadius: 0,
    padding: '0 20px',
  } as CSSProperties,
  progressBarBackgroundColor: {
    backgroundColor: 'red',
  } as CSSProperties,
};

const UploadProfilesPage = () => {
  const { t } = useTranslation();
  const { CSVReader } = useCSVReader();

  return (
    <Page title={t('user.upload')}>
      <PageTitle>{t('user.upload')}</PageTitle>
      <CSVReader
        onUploadAccepted={console.log}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => (
          <>
            <div style={styles.csvReader}>
              <button type="button" {...getRootProps()} style={styles.browseFile}>
                Browse file
              </button>
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              <button {...getRemoveFileProps()} style={styles.remove}>
                Remove
              </button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
    </Page>
  );
};

export default UploadProfilesPage;
