import React, { CSSProperties, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCSVReader } from 'react-papaparse';
import { invert, omit } from 'lodash-es';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { UploadIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Select from 'components/shared/Select';
import { IMPORTABLE_USER_FIELDS } from 'constants/userCsv';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
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

const FileUploading = () => {
  const { t, i18n } = useTranslation();
  const { CSVReader } = useCSVReader();
  const [fileKeys, setFileKeys] = useFileKeys();
  const [relativeFields, setRelativeFields] = useRelativeFields();
  const [rows, setRows] = useRows();
  const translatedUserFields = useTranslatedSelect(IMPORTABLE_USER_FIELDS, 'user', false, true);

  // custom cols
  const { data: customFieldsData = [] } = useGetCustomFormFields({
    entity: 'user',
  });
  const customUserFields = useMemo(() => customFieldsData.map((customField) => ({
    value: customField._id,
    label: customField.names[i18n.language],
  })), [customFieldsData, i18n.language]);

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
          setRows(newRows
            .filter((rowItems: string[]) => rowItems.some((rowItem) => !!rowItem))
            .map((rowItems: string[]) => {
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
                <Button
                  {...restRemoveFileProps}
                  onClick={(e) => { onClickRemove(e); reset(); }}
                  disabled={!acceptedFile}
                  color="error"
                  variant="outlined"
                >
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
                        options={[...translatedUserFields, ...customUserFields]}
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
