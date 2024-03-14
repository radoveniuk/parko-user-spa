import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import In from 'v2/components/In';
import Checkbox from 'v2/uikit/Checkbox';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';

import { ICustomFormField } from 'interfaces/form.interface';

import { ColsSettingsWrapper } from './styles';

const COLS_TREE = {
  baseFields: [
    'user.email', 'user.phone', 'user.birthDate', 'user.sex', 'user.country',
    'user.adress', 'user.source', 'user.recruiter', 'user.role', 'user.workTypes', 'user.notes', 'user.status',
  ],
  docs: {
    pass: ['user.pass.number', 'user.pass.country', 'user.pass.dateFrom', 'user.pass.dateTo', 'user.pass.issuedBy'],
    visa: ['user.visa.number', 'user.visa.dateFrom', 'user.visa.dateTo', 'user.visa.comment'],
    permit: ['user.permit.number', 'user.permit.goal', 'user.permit.isMedicalCheck',
      'user.permit.address', 'user.permit.dateFrom', 'user.permit.dateTo'],
    idcard: ['user.idcard.number', 'user.idcard.country', 'user.idcard.dateFrom', 'user.idcard.dateTo'],
  },
  bankInfo: ['user.IBAN', 'user.bankName', 'user.SWIFT'],
  employmentInfo: ['user.passNumber', 'user.rodneCislo',
    'user.medicalInsurance', 'user.birthPlace', 'user.familyStatus', 'user.birthSurname', 'user.childrenCount'],
  businessFields: ['user.businessName', 'user.businessStatus',
    'user.ICO', 'user.DIC', 'user.permitAdress', 'user.corporateBodyAddress', 'user.permitDepartment', 'user.permitNumber'],
  employment: ['user.client', 'user.project', 'user.position', 'user.cooperationStartDate',
    'user.cooperationEndDate', 'user.salary', 'user.salaryType'],
};

const DEFAULT_COLS = [
  'user.status',
];

type Props = {
  customFields: ICustomFormField[],
  activeCols: string[],
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>,
  open: boolean,
  onClose: () => void
};

const ColumnsConfig = ({ activeCols, setActiveCols, open, onClose }: Props) => {
  const { t } = useTranslation();

  const docsCols = [
    ...COLS_TREE.docs.pass,
    ...COLS_TREE.docs.permit,
    ...COLS_TREE.docs.visa,
    ...COLS_TREE.docs.idcard,
  ];

  const allCols = [
    ...COLS_TREE.bankInfo,
    ...COLS_TREE.employment,
    ...COLS_TREE.employmentInfo,
    ...COLS_TREE.baseFields,
    ...COLS_TREE.businessFields,
    ...docsCols,
  ];

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
          render={(key, value) => {
            if (key !== 'docs') {
              return (
                <div className="checkbox-group">
                  <Checkbox
                    className="selectGroup"
                    label={t(`user.${key}`)}
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
              );
            } else {
              return (
                <div>
                  <Checkbox
                    className="selectGroup"
                    label={t('user.docsFields')}
                    checked={isIncludedCols(docsCols)}
                    onChange={(e) => {
                      setActiveCols((prev) => {
                        if (e.target.checked) {
                          const set = new Set([...prev, ...docsCols]);
                          return [...set];
                        } else {
                          return prev.filter(col => !docsCols.includes(col));
                        }
                      });
                    }}
                  />
                  <In
                    data={value}
                    render={(key: string, value) => (
                      <div className="checkbox-group">
                        <Checkbox
                          className="selectSubGroup"
                          label={t(`user.${key}.${key}`)}
                          checked={isIncludedCols(value)}
                          onChange={(e) =>
                            void setActiveCols((prev) => {
                              if (e.target.checked) {
                                const set = new Set([...prev, ...value]);
                                return [...set];
                              } else {
                                return prev.filter(col => !value.includes(col));
                              }
                            })
                          }
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
                </div>
              );
            }
          }}
        />
      </ColsSettingsWrapper>
    </DialogFullscreen>
  );
};

export default memo(ColumnsConfig);