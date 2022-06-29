/* eslint-disable no-unused-vars */
import React, { CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCSVReader } from 'react-papaparse';

import Page, { PageTitle } from 'components/shared/Page';
import Select from 'components/shared/Select';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { RelativeFieldsGrid } from './styles';
import Button from 'components/shared/Button';
import { UploadIcon } from 'components/icons';
import { AnyObject } from 'interfaces/base.types';

const styles = {
  csvReader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
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
};

const userFields = ['email', 'name', 'surname', 'password', 'phone', 'IBAN', 'ICO', 'adress', 'birthDate', 'birthPlace', 'city', 'country', 'familyState', 'fatherBirthdate', 'fatherName', 'fatherSurname', 'hasChildren', 'hasIdCard', 'hasInternationalPass', 'hasPermit', 'hasPrevPermit', 'hasSiblings', 'motherBirthdate', 'motherName', 'motherPrevSurname', 'motherSurname', 'pantsSize', 'passNumber', 'prevSurname', 'shoesSize', 'speciality', 'study', 'tshortSize', 'zip', 'internationalPassAuthority', 'internationalPassExpire', 'internationalPassNumber', 'permitExpire', 'permitType', 'rodneCislo', 'internationalPassScan', 'permitFaceScan', 'idCardFaceScan', 'role', 'status', 'project'];

const UploadProfilesPage = () => {
  const { t } = useTranslation();
  const { CSVReader } = useCSVReader();
  const [fileKeys, setFileKeys] = useState<string[] | null>(null);
  const [exampleFileValues, setExampleFileValues] = useState<string[] | null>(null);
  const [relativeFields, setRelativeFields] = useState<AnyObject>({});
  const translatedUserFields = useTranslatedSelect(userFields, 'user', false);

  return (
    <Page title={t('user.uploadFromFile')}>
      <PageTitle>{t('user.uploadFromFile')}</PageTitle>
      <CSVReader
        onUploadAccepted={(res: any) => {
          setFileKeys(res.data?.[0]);
          setExampleFileValues(res.data?.[1]);
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => (
          <>
            <div style={styles.csvReader}>
              <Button {...getRootProps()}>
                <UploadIcon /> {t('user.upload')}
              </Button>
              <div style={styles.acceptedFile}>
                {acceptedFile && acceptedFile.name}
              </div>
              <Button {...getRemoveFileProps()} color="error" variant="outlined" >
                {t('user.remove')}
              </Button>
            </div>
            <ProgressBar style={{ backgroundColor: '#123C69' }} />
          </>
        )}
      </CSVReader>
      <RelativeFieldsGrid>
        <div><b>{t('user.fileField')}</b></div>
        <div><b>{t('user.field')}</b></div>
        <div><b>{t('user.exampleValue')}</b></div>
        {fileKeys?.map((fileKey, index) => (
          <div key={fileKey} style={{ display: 'contents' }}>
            <div>{fileKey}</div>
            <Select options={translatedUserFields} label={t('user.field')} />
            <div>{exampleFileValues?.[index]}</div>
          </div>
        ))}
      </RelativeFieldsGrid>
    </Page>
  );
};

export default UploadProfilesPage;
