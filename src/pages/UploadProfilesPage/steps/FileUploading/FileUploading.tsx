import React, { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useCSVReader } from 'react-papaparse';
import { invert, omit } from 'lodash-es';

import Select from 'components/shared/Select';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import Button from 'components/shared/Button';
import { UploadIcon } from 'components/icons';
import { AnyObject } from 'interfaces/base.types';
import { useFileKeys, useRelativeFields, useRows } from '../../UploadProfilesContext';

import { FileUploadingWrapper, RelativeFieldsGrid } from './styles';

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
    height: 35,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: '40%',
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

const FileUploading = () => {
  const { t } = useTranslation();
  const { CSVReader } = useCSVReader();
  const [fileKeys, setFileKeys] = useFileKeys();
  const [relativeFields, setRelativeFields] = useRelativeFields();
  const [rows, setRows] = useRows();
  const translatedUserFields = useTranslatedSelect(userFields, 'user', false);

  const reset = () => {
    setFileKeys([]);
    setRelativeFields({});
    setRows([]);
  };

  return (
    <FileUploadingWrapper>
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
        }: any) => {
          const { onClick: onClickRemove, ...restRemoveFileProps } = getRemoveFileProps();
          return (
            <>
              <div style={styles.csvReader}>
                <Button {...getRootProps()} style={{ display: 'flex', gap: 5 }}>
                  <UploadIcon size={20}/>{t('user.upload')}
                </Button>
                <div style={styles.acceptedFile}>
                  {acceptedFile && acceptedFile.name}
                </div>
                <Button {...restRemoveFileProps} onClick={(e) => { onClickRemove(e); reset(); }} color="error" variant="outlined">
                  {t('userUpload.remove')}
                </Button>
              </div>
              <ProgressBar style={{ backgroundColor: '#123C69' }} />
              {!!acceptedFile && !!fileKeys.length && (
                <RelativeFieldsGrid>
                  <div><b>{t('userUpload.fileField')}</b></div>
                  <div><b>{t('userUpload.field')}</b></div>
                  <div><b>{t('userUpload.exampleValue')}</b></div>
                  {fileKeys?.map((fileKey) => (
                    <div key={fileKey} style={{ display: 'contents' }}>
                      <div>{fileKey}</div>
                      <Select
                        options={translatedUserFields}
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
            </>
          );
        }}
      </CSVReader>
    </FileUploadingWrapper>
  );
};

export default FileUploading;
