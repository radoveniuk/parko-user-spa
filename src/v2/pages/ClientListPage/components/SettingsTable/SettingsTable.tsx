import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';

import Checkbox from 'components/shared/Checkbox';
import { EXPORT_USER_FIELDS } from 'constants/userCsv';

import { ColsSettingsWrapper } from './styles';

const COLS_TO_SETTINGS = EXPORT_USER_FIELDS.filter((item) => !['name', 'email'].includes(item)).map((col) => `client.${col}`);

const DEFAULT_COLS = [
  'client.email',
  'client.sidlo',
];

type Props = {
  activeCols: string[],
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>,
  open: boolean,
  onClose: () => void
};

const SettingsTable = ({ activeCols, setActiveCols, open, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <DialogFullscreen open={open} onClose={onClose} width={500} title={t('cols')}>
      <ColsSettingsWrapper>
        <div className="cols">
          <Checkbox
            title={t('selectAll')}
            checked={activeCols.length === COLS_TO_SETTINGS.length}
            onChange={(e) =>
              void setActiveCols(() => {
                if (e.target.checked) {
                  return [
                    ...COLS_TO_SETTINGS,
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
              title={t(field)}
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
        </div>
      </ColsSettingsWrapper>
    </DialogFullscreen>
  );
};

export default memo(SettingsTable);
