import React from 'react';
import { DateTime } from 'luxon';
import Tooltip from 'v2/uikit/Tooltip';

import { getDateFromIso } from 'helpers/datetime';
import { IUser } from 'interfaces/users.interface';

import { DocItem, DocItems } from './styles';

export const getFieldSectionLabelMap = (t: (v: string) => string) => {
  const UPDATE_SECTION_MAP: Record<keyof IUser, string> = {
    notes: `${t('user.baseFields')} > ${t('user.notes')}`,
    source: `${t('user.baseFields')} > ${t('user.source')}`,
    role: `${t('user.baseFields')} > ${t('user.role')}`,
    name: `${t('user.baseFields')} > ${t('user.name')}`,
    _id: '',
    nickname: `${t('user.baseFields')} > ${t('user.nickname')}`,
    surname: `${t('user.baseFields')} > ${t('user.surname')}`,
    email: `${t('user.baseFields')} > ${t('user.email')}`,
    password: `${t('user.baseFields')} > ${t('user.password')}`,
    phone: `${t('user.baseFields')} > ${t('user.phone')}`,
    birthDate: `${t('user.baseFields')} > ${t('user.birthDate')}`,
    passNumber: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.passNumber')}`,
    sex: `${t('user.baseFields')} > ${t('user.sex')}`,
    blocked: `${t('user.baseFields')} > ${t('user.blocked')}`,
    recruiter: `${t('user.baseFields')} > ${t('user.recruiter')}`,
    project: `${t('user.baseFields')} > ${t('user.project')}`,
    country: `${t('user.baseFields')} > ${t('user.country')}`,
    adress: `${t('user.baseFields')} > ${t('user.adress')}`,
    city: `${t('user.baseFields')} > ${t('user.city')}`,
    zip: `${t('user.baseFields')} > ${t('user.zip')}`,
    hasPermit: `${t('user.baseFields')} > ${t('user.hasPermit')}`,
    rodneCislo: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.rodneCislo')}`,
    permitStartDate: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitStartDate')}`,
    permitExpire: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitExpire')}`,
    permitType: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitType')}`,
    hasMedicalExamination: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.hasMedicalExamination')}`,
    IBAN: `${t('user.info')} > ${t('user.bankInfo')} > IBAN`,
    bankName: `${t('user.info')} > ${t('user.bankInfo')} > ${t('user.bankName')}`,
    SWIFT: `${t('user.info')} > ${t('user.bankInfo')} > SWIFT`,
    ICO: `${t('user.info')} > ${t('user.businessFields')} > ${t('user.ICO')}`,
    DIC: `${t('user.info')} > ${t('user.businessFields')} > ${t('user.DIC')}`,
    permitAdress: `${t('user.info')} > ${t('user.businessFields')} > ${t('user.permitAdress')}`,
    permitDepartment: `${t('user.info')} > ${t('user.businessFields')} > ${t('user.permitAdress')}`,
    permitNumber: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    tshortSize: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.tshortSize')}`,
    pantsSize: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.pantsSize')}`,
    shoesSize: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.shoesSize')}`,
    employmentType: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.employmentType')}`,
    cooperationType: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    position: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    cooperationStartDate: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    cooperationEndDate: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    status: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    customFields: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    otherScans: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    salary: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    salaryType: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    salaryComment: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    internationalPassScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    passScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    idCardFaceScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    idCardBackScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    permitFaceScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    permitBackScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    docs: `${t('user.info')} > ${t('user.docsFields')}`,
    projectStages: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    medicalInsurance: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    birthPlace: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    familyStatus: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    birthSurname: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    childrenCount: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    history: '',
    createdBy: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    updatedBy: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    tags: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    createdAt: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    updatedAt: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitAdress')}`,
    businessName: `${t('user.info')} > ${t('user.businessFields')} > ${t('user.businessName')}`,
    businessStatus: `${t('user.info')} > ${t('user.businessFields')} > ${t('user.businessStatus')}`,
  };
  return UPDATE_SECTION_MAP;
};

export const renderValue = (key: keyof IUser, value: string | boolean | number, t: (v: string) => string) => {
  if (typeof value === 'boolean') {
    return t(value.toString());
  }
  const isIso = !DateTime.fromISO(value?.toString()).invalidReason;
  if (isIso) {
    return getDateFromIso(value);
  }
  const selectKeys: (keyof IUser)[] = ['permitType', 'employmentType'];
  if (selectKeys.includes(key)) {
    return value ? t(`selects.${key}.${value}`) : '';
  }
  return value;
};

const DocField = (props: { label: string, value: string | boolean | number }) => (
  <div className="field">
    <div className="fieldTitle">{props.label}</div>
    <Tooltip title={props.value.toString()}><div className="fieldValue">{props.value}</div></Tooltip>
  </div>
);

export const renderDocs = (
  docs: Record<string, string | boolean>[],
  isNew: boolean,
  t: (v: string) => string,
) => (
  <DocItems>
    {docs.map((docItem, index) => (
      <DocItem key={index} className={isNew ? 'new' : 'old'}>
        {docItem.type === 'pass' && (
          <>
            <div className="title">{t('user.internationalPassScan')}</div>
            <div className="fields">
              <DocField label={t('doc.number')} value={docItem.number} />
              <DocField label={t('doc.issuerCountry')} value={docItem.country} />
              <DocField label={t('doc.dateFrom')} value={getDateFromIso(docItem.dateFrom)} />
              <DocField label={t('doc.dateTo')} value={getDateFromIso(docItem.dateTo)} />
              <DocField label={t('doc.issuedBy')} value={docItem.issuedBy} />
            </div>
          </>
        )}
        {docItem.type === 'visa' && (
          <>
            <div className="title">{t('user.visa')}</div>
            <div className="fields">
              <DocField label={t('doc.number')} value={docItem.number} />
              <DocField label={t('doc.dateFrom')} value={getDateFromIso(docItem.dateFrom)} />
              <DocField label={t('doc.dateTo')} value={getDateFromIso(docItem.dateTo)} />
              <DocField label={t('comment')} value={docItem.comment} />
            </div>
          </>
        )}
        {docItem.type === 'permit' && (
          <>
            <div className="title">{t('user.permit')}</div>
            <div className="fields">
              <DocField label="ID" value={docItem.id} />
              <DocField label={t('user.permitGoal')} value={t(`selects.permitType.${docItem.goal}`)} />
              <DocField label={t('doc.dateFrom')} value={getDateFromIso(docItem.dateFrom)} />
              <DocField label={t('doc.dateTo')} value={getDateFromIso(docItem.dateTo)} />
              <DocField label={t('user.adress')} value={docItem.address} />
              <DocField label={t('doc.number')} value={docItem.number} />
              <DocField label={t('user.hasMedicalExamination')} value={t(docItem.isMedicalCheck.toString())} />
            </div>
          </>
        )}
      </DocItem>
    ))}
  </DocItems>
);
