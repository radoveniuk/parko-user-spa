import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import In from 'v2/components/In';
import Checkbox from 'v2/uikit/Checkbox';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';

import { ColsSettingsWrapper } from './styles';

const COLS_TREE = {
  baseFields: [
    'client.sidlo',
    'client.shortName',
    'client.comment',
  ],
  contacts: [
    'client.websiteUrl',
    'client.email',
    'client.phone',
  ],
  financial: [
    'client.ICO',
    'client.DIC',
    'client.ICDPH',
  ],
  cooperation: [
    'client.status',
    'client.cooperationStartDate',
    'client.cooperationEndDate',
    'client.managers',
    'client.contactPerson',
    'client.contactPersonPosition',
  ],
};

const DEFAULT_COLS = [
  'client.status',
];

type Props = {
  activeCols: string[],
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>,
  open: boolean,
  onClose: () => void
};

const ColumnsConfig = ({ activeCols, setActiveCols, open, onClose }: Props) => {
  const { t } = useTranslation();

  const allCols = Object.values(COLS_TREE).flatMap(col => col);

  const isIncludedCols = (cols: string[]) => {
    const activeSet = new Set(activeCols);
    const colsSet = new Set(cols);
    for (const item of colsSet) {
      if (!activeSet.has(item)) return false;
    }
    return true;
  };

  return (
    <DialogFullscreen open={open} onClose={onClose} width={500} title={t('cols')}>
      <ColsSettingsWrapper>
        <Checkbox
          className="selectAll"
          label={t('selectAll')}
          checked={activeCols.length === allCols.length}
          onChange={(e) =>
            void setActiveCols(() => {
              if (e.target.checked) {
                return allCols;
              } else {
                return DEFAULT_COLS;
              }
            })
          }
        />
        <In
          data={COLS_TREE}
          render={(key, value) => (
            <div className="checkbox-group">
              <Checkbox
                className="selectGroup"
                label={t(`client.${key}`)}
                checked={isIncludedCols(value)}
                onChange={(e) => {
                  setActiveCols((prev) => {
                    if (e.target.checked) {
                      const set = new Set([...prev, ...value]);
                      return [...set];
                    } else {
                      return prev.filter(col => !value.includes(col));
                    }
                  });
                }}
              />
              <div className="cols">
                {value.map((col: string) => (
                  <Checkbox
                    key={col}
                    label={t(col)}
                    checked={activeCols.includes(col)}
                    onChange={e => {
                      setActiveCols((prev: any) => {
                        if (e.target.checked) {
                          return [...prev, col];
                        } else {
                          return prev.filter((item: any) => item !== col);
                        }
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        />
      </ColsSettingsWrapper>
    </DialogFullscreen>
  );
};

export default memo(ColumnsConfig);
