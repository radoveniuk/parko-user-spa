import React, { memo, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';

import { SettingsIcon } from 'components/icons';
import Checkbox from 'components/shared/Checkbox';
import { EXPORT_USER_FIELDS } from 'constants/userCsv';
import useOutsideClick from 'hooks/useOutsideClick';

const COLS_TO_SETTINGS = EXPORT_USER_FIELDS.filter((item) => !['name', 'surname'].includes(item)).map((col) => `user.${col}`);

const DEFAULT_COLS = [
  'user.birthDate',
  'user.project',
  'user.status',
];

const SettingsTable = ({ customFields, activeCols, setActiveCols }: any) => {
  const { t, i18n } = useTranslation();

  const [openColsSettins, setOpenColsSettings] = useState(false);
  const colsSettingsRef = useRef<HTMLDivElement>(null);

  const customColumns = useMemo(() => customFields.map((customField: any) => customField.names[i18n.language]), [customFields, i18n.language]);

  useOutsideClick(colsSettingsRef, () => {
    setOpenColsSettings(false);
  });

  const toggleColumnsSettings = () => {
    setOpenColsSettings((prev) => !prev);
  };

  return (
    <div className="cols-settings-wrapper" ref={colsSettingsRef}>
      <IconButton onClick={toggleColumnsSettings}>
        <SettingsIcon />
      </IconButton>
      {openColsSettins && (
        <div className="cols-settings">
          <Checkbox
            title={t('selectAll')}
            checked={activeCols.length === COLS_TO_SETTINGS.length + customColumns.length}
            onChange={e =>
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
          {COLS_TO_SETTINGS.map(field => (
            <Checkbox
              key={field}
              title={t(field)}
              checked={activeCols.includes(field)}
              onChange={e =>
                void setActiveCols((prev: any) => {
                  if (e.target.checked) {
                    return [...prev, field];
                  } else {
                    return prev.filter((item: any) => item !== field);
                  }
                })
              }
            />
          ))}
          {customFields.map((field: any) => (
            <Checkbox
              key={field._id}
              title={field.names[i18n.language]}
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
      )}
    </div>
  );
};

export default memo(SettingsTable);
