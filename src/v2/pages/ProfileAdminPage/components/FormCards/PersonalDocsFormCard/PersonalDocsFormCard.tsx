import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash-es/isEqual';
import { Button, Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';

import { CloseIcon, PersonalDocIcon, PlusIcon } from 'components/icons';
import useListState from 'hooks/useListState';
import { UserPersonalDocType } from 'interfaces/users.interface';

import InternationalPass from './components/InternationalPass';
import Pass from './components/Pass';
import Permit from './components/Permit';
import Visa from './components/Visa';
import { DocItem, DocList } from './styles';
import { IntPassInfo, PassInfo, PermitInfo, VisaInfo } from './types';

const DEFAULT_INT_PASS: IntPassInfo = {
  type: 'pass',
  number: '',
  dateFrom: '',
  dateTo: '',
  country: '',
  issuedBy: '',
};

const DEFAULT_PASS: PassInfo = {
  type: 'idcard',
  number: '',
  dateFrom: '',
  dateTo: '',
  country: '',
};

const DEFAULT_PERMIT: PermitInfo = {
  type: 'permit',
  number: '',
  dateFrom: '',
  dateTo: '',
  goal: '',
  address: '',
  isMedicalCheck: true,
};

const DEFAULT_VISA: VisaInfo = {
  type: 'visa',
  number: '',
  dateFrom: '',
  dateTo: '',
  comment: '',
};

type Doc = (Record<string, string | boolean> & { type: UserPersonalDocType });

type Props = {
  data: Doc[];
  onUpdateDocs?(docs: Doc[]): void;
};

const PersonalDocsFormCard = ({ data, onUpdateDocs }: Props) => {
  const { t } = useTranslation();

  const [docs, { add, remove, update }, setDocs] = useListState(data);

  const [deleteDialogData, setDeleteDialogData] = useState<Doc | null>(null);

  const removeDocHandler = () => {
    if (deleteDialogData !== null) {
      remove(deleteDialogData);
    }
  };

  const missingDocs = useMemo(() => [
    { type: 'pass', label: 'user.pass.pass', defaultValues: DEFAULT_INT_PASS },
    { type: 'permit', label: 'user.permit.permit', defaultValues: DEFAULT_PERMIT },
    { type: 'visa', label: 'user.visa.visa', defaultValues: DEFAULT_VISA },
    { type: 'idcard', label: 'user.pass', defaultValues: DEFAULT_PASS },
  ].filter((item) => !docs.some((docItem) => docItem.type === item.type)), [docs]);

  useEffect(() => {
    if (!isEqual(data, docs)) {
      setDocs(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setDocs]);

  const formCardRef = useRef<HTMLDivElement>(null);

  return (
    <FormCard
      defaultConfig={{ triggerAll: false, disabled: true }}
      onOutsideClick={({ warn }) => {
        warn();
      }}
    >
      {({ formCardConfig, updateFormCardConfig }) => (
        <>
          <FormCardHeader icon={<PersonalDocIcon size={24} />} title={t('user.docsFields')}>
            {formCardConfig.disabled && <Button onClick={() => void updateFormCardConfig({ disabled: false })}>{t('edit')}</Button>}
            {!formCardConfig.disabled && (
              <Button
                color="error"
                onClick={() => {
                  updateFormCardConfig({ triggerAll: true });
                  setTimeout(() => {
                    const formCardEl = formCardRef.current;
                    if (formCardEl) {
                      const errorFields = formCardEl.querySelectorAll('.error');
                      if (!errorFields.length) {
                        onUpdateDocs?.(docs);
                        updateFormCardConfig({ disabled: true });
                      }
                    }
                    updateFormCardConfig({ triggerAll: false });
                  }, 100);
                }}
              >
                {t('save')}
              </Button>)}
          </FormCardHeader>
          <FormCardBody ref={formCardRef}>
            <DocList>
              {docs.map((docItem) => (
                <DocItem key={docItem.type}>
                  <IconButton
                    disabled={formCardConfig.disabled}
                    className="delete-btn"
                    onClick={() => void setDeleteDialogData(docItem)}
                  >
                    <CloseIcon size={24} />
                  </IconButton>
                  {docItem.type === 'idcard' && (
                    <Pass
                      data={docItem as PassInfo}
                      disabled={formCardConfig.disabled}
                      onUpdate={(values) => void update(docItem, values)}
                      triggerAllFields={formCardConfig.triggerAll}
                    />
                  )}
                  {docItem.type === 'pass' && (
                    <InternationalPass
                      data={docItem as IntPassInfo}
                      disabled={formCardConfig.disabled}
                      onUpdate={(values) => void update(docItem, values)}
                      triggerAllFields={formCardConfig.triggerAll}
                    />
                  )}
                  {docItem.type === 'permit' && (
                    <Permit
                      data={docItem as PermitInfo}
                      disabled={formCardConfig.disabled}
                      onUpdate={(values) => void update(docItem, values)}
                      triggerAllFields={formCardConfig.triggerAll}
                    />
                  )}
                  {docItem.type === 'visa' && (
                    <Visa
                      data={docItem as VisaInfo}
                      disabled={formCardConfig.disabled}
                      onUpdate={(values) => void update(docItem, values)}
                      triggerAllFields={formCardConfig.triggerAll}
                    />)}
                </DocItem>
              ))}
            </DocList>
            <Menu
              isCloseOnMenu
              disabled={formCardConfig.disabled}
              menuComponent={<Button variant="outlined" disabled={formCardConfig.disabled}><PlusIcon />{t('user.addDoc')}</Button>}
            >
              {missingDocs.map((missingDoc) => (
                <MenuItem
                  key={missingDoc.type}
                  onClick={() => missingDoc.defaultValues ? add(missingDoc.defaultValues) : undefined}
                >
                  {t(missingDoc.label)}
                </MenuItem>
              ))}
            </Menu>
          </FormCardBody>
          <DialogConfirm
            open={deleteDialogData !== null}
            onSubmit={() => {
              removeDocHandler();
              setDeleteDialogData(null);
            }}
            onClose={() => void setDeleteDialogData(null)}
          />
        </>
      )}
    </FormCard>
  );
};

export default memo(PersonalDocsFormCard);
