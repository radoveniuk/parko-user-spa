import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash-es/isEqual';
import In from 'v2/components/In';
import Checkbox from 'v2/uikit/Checkbox';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';

import { ICustomFormFieldSectionBinding, ICustomFormSection } from 'interfaces/form.interface';

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
    'user.ICO', 'user.DIC', 'user.permitAdress', 'user.corporateBodyAddress',
    'user.permitDepartment', 'user.permitNumber', 'user.businessActivities'],
  employment: ['user.client', 'user.clientCompany', 'user.project', 'user.position', 'user.cooperationStartDate',
    'user.cooperationEndDate', 'user.salary', 'user.salaryType', 'user.employmentRecruiter'],
  systemFields: ['user.createdAt', 'user.updatedAt', 'user.createdBy', 'user.updatedBy'],
};

const DEFAULT_COLS = [
  'user.status',
];

type ColsUpdater = (prev: string[]) => string[];

type Props = {
  customFields: ICustomFormFieldSectionBinding<true>[],
  activeCols: string[],
  setActiveCols: React.Dispatch<React.SetStateAction<string[]>>,
  open: boolean,
  onClose: () => void
};

const ColumnsConfig = ({ activeCols, setActiveCols, open, onClose, customFields }: Props) => {
  const { t, i18n } = useTranslation();
  const [localeActiveCols, setLocaleActiveCols] = useState(activeCols);

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
    const activeSet = new Set(localeActiveCols);
    const colsSet = new Set(cols);
    for (const item of colsSet) {
      if (!activeSet.has(item)) return false;
    }
    return true;
  };

  // Custom fields
  const customSections = useMemo(() => {
    const sections: ICustomFormSection[] = [];
    customFields.forEach((bindingData) => {
      if (!sections.some(section => section._id === bindingData.section._id)) {
        sections.push(bindingData.section);
      }
    });
    return sections;
  }, [customFields]);

  // debounce update of cols
  const updateCols = useCallback((colsUpdater: ColsUpdater) => {
    const cols = colsUpdater(localeActiveCols);
    setLocaleActiveCols(cols);
    setTimeout(() => {
      setActiveCols(cols);
    }, 100);
  }, [localeActiveCols, setActiveCols]);

  useEffect(() => {
    if (!isEqual(activeCols, localeActiveCols)) {
      setLocaleActiveCols(activeCols);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCols]);

  return (
    <DialogFullscreen open={open} onClose={onClose} width={500} title={t('cols')}>
      <ColsSettingsWrapper>
        <Checkbox
          className="selectAll"
          label={t('selectAll')}
          checked={localeActiveCols.length === allCols.length}
          onChange={(e) => {
            const activeColsSetter = () => {
              if (e.target.checked) {
                return allCols;
              } else {
                return DEFAULT_COLS;
              }
            };
            updateCols(activeColsSetter);
          }}
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
                      const activeColsSetter = (prev: string[]) => {
                        if (e.target.checked) {
                          const set = new Set([...prev, ...value]);
                          return [...set];
                        } else {
                          return prev.filter(col => !value.includes(col));
                        }
                      };
                      updateCols(activeColsSetter);
                    }}
                  />
                  <div className="cols">
                    {value.map((col: string) => (
                      <Checkbox
                        key={col}
                        label={t(col)}
                        checked={localeActiveCols.includes(col)}
                        onChange={e => {
                          const activeColsSetter = (prev: string[]) => {
                            if (e.target.checked) {
                              return [...prev, col];
                            } else {
                              return prev.filter((item) => item !== col);
                            }
                          };
                          updateCols(activeColsSetter);
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
                      const activeColsSetter = (prev: string[]) => {
                        if (e.target.checked) {
                          const set = new Set([...prev, ...docsCols]);
                          return [...set];
                        } else {
                          return prev.filter(col => !docsCols.includes(col));
                        }
                      };
                      updateCols(activeColsSetter);
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
                          onChange={(e) => {
                            const activeColsSetter = (prev: string[]) => {
                              if (e.target.checked) {
                                const set = new Set([...prev, ...value]);
                                return [...set];
                              } else {
                                return prev.filter(col => !value.includes(col));
                              }
                            };
                            updateCols(activeColsSetter);
                          }}
                        />
                        <div className="cols">
                          {value.map((col: string) => (
                            <Checkbox
                              key={col}
                              label={t(col)}
                              checked={localeActiveCols.includes(col)}
                              onChange={e => {
                                const activeColsSetter = (prev: string[]) => {
                                  if (e.target.checked) {
                                    return [...prev, col];
                                  } else {
                                    return prev.filter((item: any) => item !== col);
                                  }
                                };
                                updateCols(activeColsSetter);
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
        {customSections.map((section) => {
          const bindings = customFields.filter(bindingItem => bindingItem.section._id === section._id);
          return (
            <div className="checkbox-group" key={section._id}>
              <Checkbox
                className="selectGroup"
                label={section.names[i18n.language]}
                checked={isIncludedCols(bindings.map((item) => item._id))}
                onChange={(e) => {
                  setActiveCols((prev) => {
                    const ids = bindings.map((item) => item._id);
                    if (e.target.checked) {
                      const set = new Set([...prev, ...ids]);
                      return [...set];
                    } else {
                      return prev.filter(col => !ids.includes(col));
                    }
                  });
                }}
              />
              <div className="cols">
                {bindings.map((binding) => (
                  <Checkbox
                    key={binding._id}
                    label={binding.field?.names[i18n.language]}
                    checked={activeCols.includes(binding._id)}
                    onChange={e => {
                      setActiveCols((prev: any) => {
                        if (e.target.checked) {
                          return [...prev, binding._id];
                        } else {
                          return prev.filter((item: any) => item !== binding._id);
                        }
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          );
        },
        )}
      </ColsSettingsWrapper>
    </DialogFullscreen>
  );
};

export default memo(ColumnsConfig);
