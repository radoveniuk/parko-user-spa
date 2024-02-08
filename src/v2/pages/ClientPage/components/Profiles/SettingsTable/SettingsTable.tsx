import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Checkbox from 'v2/uikit/Checkbox';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';

import { EXPORT_USER_DOC_FIELDS, EXPORT_USER_FIELDS } from 'constants/userCsv';
import { ICustomFormField } from 'interfaces/form.interface';

import { ColsSettingsWrapper } from './styles';

const COLS_TO_SETTINGS = [
  ...EXPORT_USER_FIELDS, ...EXPORT_USER_DOC_FIELDS,
].filter((item) => !['name', 'surname'].includes(item)).map((col) => `user.${col}`);

const DEFAULT_COLS = [
  'user.email',
];

type Props = {
  customFields: ICustomFormField[],
  activeCols: string[],
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>,
  open: boolean,
  onClose: () => void
};

const SettingsTable = ({ customFields, activeCols, setActiveCols, open, onClose }: Props) => {
  const { t, i18n } = useTranslation();

  const customColumns = useMemo(() => customFields.map((customField) => customField.names[i18n.language]), [customFields, i18n.language]);

  return (
    <DialogFullscreen open={open} onClose={onClose} width={500} title={t('cols')}>
      <ColsSettingsWrapper>
        <div className="cols">
          <Checkbox
            label={t('selectAll')}
            checked={activeCols.length === COLS_TO_SETTINGS.length + customColumns.length}
            onChange={(e) =>
              void setActiveCols(() => {
                if (e.target.checked) {
                  return [
                    ...COLS_TO_SETTINGS,
                    ...customFields.map((customField: any) => customField._id),
                  ];
                } else {
                  return DEFAULT_COLS;
                }
              })
            }
          />
          <div/>
          {COLS_TO_SETTINGS.map(field => (
            <Checkbox
              key={field}
              label={t(field)}
              checked={activeCols.includes(field)}
              onChange={e => {
                setActiveCols((prev: any) => {
                  if (e.target.checked) {
                    return [...prev, field];
                  } else {
                    return prev.filter((item: any) => item !== field);
                  }
                });
              }
              }
            />
          ))}
          {customFields.map((field: any) => (
            <Checkbox
              key={field._id}
              label={field.names[i18n.language]}
              checked={activeCols.includes(field._id)}
              onChange={e =>
                void setActiveCols((prev: any) => {
                  if (e.target.checked) {
                    return [...prev, field._id];
                  } else {
                    return prev.filter((item: any) => item !== field._id);
                  }
                })
              }
            />
          ))}
        </div>
      </ColsSettingsWrapper>
    </DialogFullscreen>
  );
};

export default memo(SettingsTable);
