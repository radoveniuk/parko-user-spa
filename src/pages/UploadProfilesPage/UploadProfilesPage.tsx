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
import { invert, omit, pick } from 'lodash-es';
import { IUser } from 'interfaces/users.interface';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';

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

const userFields = ['email', 'name', 'surname', 'phone',
  'IBAN', 'ICO', 'adress', 'birthDate', 'birthPlace', 'city', 'country',
  'familyState', 'fatherBirthdate', 'fatherName', 'fatherSurname', 'hasChildren',
  'hasIdCard', 'hasInternationalPass', 'hasPermit', 'hasPrevPermit', 'hasSiblings',
  'motherBirthdate', 'motherName', 'motherPrevSurname', 'motherSurname', 'pantsSize',
  'passNumber', 'prevSurname', 'shoesSize', 'speciality', 'study', 'tshortSize', 'zip',
  'internationalPassAuthority', 'internationalPassExpire', 'internationalPassNumber',
  'permitExpire', 'permitType', 'rodneCislo', 'role', 'status',
];

const UploadProfilesPage = () => {
  const { t } = useTranslation();

  // first step
  const { CSVReader } = useCSVReader();
  const [fileKeys, setFileKeys] = useState<string[] | null>(null);
  const [relativeFields, setRelativeFields] = useState<AnyObject>({});
  const [rows, setRows] = useState<AnyObject[]>([]);
  const translatedUserFields = useTranslatedSelect(userFields, 'user', false);

  // second step
  const [usersResult, setUsersResult] = useState<IUser[] | null>(null);

  console.log(usersResult);

  return (
    <Page title={t('user.uploadFromFile')}>
      <PageTitle>{t('user.uploadFromFile')}</PageTitle>
      <CSVReader
        onUploadAccepted={(res: any) => {
          setFileKeys(res.data?.[0]);
          const [headerRow, ...newRows] = res.data;
          newRows.pop();
          setRows(newRows.map((rowItems: string[]) => {
            const rowObject: AnyObject = {};
            rowItems.forEach((rowItem, index) => {
              rowObject[headerRow[index]] = rowItem;
            });
            return rowObject;
          }));
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
      {fileKeys?.length && (
        <RelativeFieldsGrid>
          <div><b>{t('user.fileField')}</b></div>
          <div><b>{t('user.field')}</b></div>
          <div><b>{t('user.exampleValue')}</b></div>
          {fileKeys?.map((fileKey, index) => (
            <div key={fileKey} style={{ display: 'contents' }}>
              <div>{fileKey}</div>
              <Select
                options={translatedUserFields}
                label={t('user.field')}
                onChange={(e) => {
                  setRelativeFields((prevValue) => {
                    let newValue = prevValue;
                    const keyValue = e.target.value as string;
                    const reverseKey = invert(newValue)[keyValue];

                    if (reverseKey) {
                      newValue = omit(newValue, [reverseKey]);
                    }
                    if (!fileKey) {
                      return newValue;
                    }
                    return { ...newValue, [fileKey]: keyValue };
                  });
                }}
                value={relativeFields[fileKey] || ''}
              />
              <div>{rows[0]?.[fileKey]}</div>
            </div>
          ))}
        </RelativeFieldsGrid>
      )}

      <Button onClick={() => void setUsersResult(rows
        .map((row) => {
          const pickedRow = pick(row, Object.keys(relativeFields));
          const oldKeys = Object.keys(pickedRow);
          const newRow: AnyObject = {};
          oldKeys.forEach((oldKey) => {
            newRow[relativeFields[oldKey]] = pickedRow[oldKey];
          });
          return newRow;
        }) as IUser[])}>next</Button>
      {usersResult && (
        <ListTable columns={Object.keys(invert(relativeFields)).map((field) => `user.${field}`)} >
          {usersResult?.map((user, index) => (
            <ListTableRow key={index}>
              {(Object.keys(invert(relativeFields)) as (keyof IUser)[]).map((field) =>
                <ListTableCell key={field}>{user[field] as string}</ListTableCell>)}
            </ListTableRow>
          ))}
        </ListTable>
      )}
    </Page>
  );
};

export default UploadProfilesPage;
