import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import In from 'v2/components/In';
import { useTableColumns } from 'v2/contexts/TableColumnsContext';
import Checkbox from 'v2/uikit/Checkbox';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';

import { ColsSettingsWrapper } from './styles';

const COLS_TREE = {
  userFields: [
    'accommodation.client',
    'accommodation.project',
    'accommodation.userFullname',
    'accommodation.userStatus',
    'accommodation.userCooperationType',
    'accommodation.userCooperationStartDate',
    'accommodation.userCooperationEndDate',
  ],
  accommodationFields: [
    'accommodation.name',
    'accommodation.adress',
  ],
  residenceFields: [
    'accommodation.checkIn',
    'accommodation.checkOut',
    'accommodation.days',
    'accommodation.costNight',
    'accommodation.costMonth',
    'accommodation.sum',
  ],
  projectAccommodations: [
    'accommodation.damageCompencationPrice',
    'accommodation.reinvoicingPrice',
  ],
  systemFields: [
    'accommodation.createdBy',
    'accommodation.updatedBy',
    'accommodation.createdAt',
    'accommodation.updatedAt',
  ],
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const ColumnsConfig = ({ open, onClose }: Props) => {
  const { t } = useTranslation();
  const [activeCols, { add, remove }, setActiveCols] = useTableColumns();

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
                  'accommodation.userFullname',
                  ...COLS_TREE.accommodationFields,
                  ...COLS_TREE.residenceFields,
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
                label={t(`accommodation.${key}`)}
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
