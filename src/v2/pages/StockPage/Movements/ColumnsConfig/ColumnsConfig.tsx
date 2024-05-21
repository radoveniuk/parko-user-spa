import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import In from 'v2/components/In';
import Checkbox from 'v2/uikit/Checkbox';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';

import { useColumns } from '../../contexts/ColumnsContext';

import { ColsSettingsWrapper } from './styles';

const COLS_TREE = {
  baseFields: [
    'stock.property',
    'stock.type',
    'stock.count',
    'stock.contractor',
    'stock.date',
    'stock.recorder',
  ],
  userFields: [
    'stock.user',
    'stock.project',
    'stock.client',
    'stock.userStatus',
    'stock.userCooperationType',
    'stock.userCooperationStartDate',
    'stock.userCooperationEndDate',
  ],
  writeOffFields: [
    'stock.writeoffReason',
    'stock.damageCompencationPrice',
  ],
  systemFields: [
    'stock.createdBy',
    'stock.updatedBy',
    'stock.createdAt',
    'stock.updatedAt',
  ],
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const ColumnsConfig = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const [activeCols, { add, remove }, setActiveCols] = useColumns();

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
                return [
                  'stock.property',
                  'stock.type',
                  'stock.count',
                  'stock.user',
                ];
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
                label={t(`stock.${key}`)}
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
                      if (e.target.checked) {
                        add(col);
                      } else {
                        remove(col);
                      }
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
