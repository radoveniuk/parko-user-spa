import React from 'react';
import { DateTime } from 'luxon';
import Tooltip from 'v2/uikit/Tooltip';

import { getDateFromIso } from 'helpers/datetime';
import { IUser } from 'interfaces/users.interface';

import { DocItem, DocItems } from './styles';

export const getFieldSectionLabelMap = (t: (v: string) => string) => {
  const UPDATE_SECTION_MAP: Partial<Record<keyof IUser, string>> = {
    notes: `${t('user.baseFields')} > ${t('user.notes')}`,
    source: `${t('user.baseFields')} > ${t('user.source')}`,
    role: `${t('user.baseFields')} > ${t('user.role')}`,
    name: `${t('user.baseFields')} > ${t('user.name')}`,
    nickname: `${t('user.baseFields')} > ${t('user.nickname')}`,
    surname: `${t('user.baseFields')} > ${t('user.surname')}`,
    email: `${t('user.baseFields')} > ${t('user.email')}`,
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
    permitDepartment: `${t('user.info')} > ${t('user.businessFields')} > ${t('user.permitDepartment')}`,
    permitNumber: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitNumber')}`,
    tshortSize: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.tshortSize')}`,
    pantsSize: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.pantsSize')}`,
    shoesSize: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.shoesSize')}`,
    employmentType: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.employmentType')}`,
    cooperationType: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.cooperationType')}`,
    position: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.position')}`,
    cooperationStartDate: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.cooperationStartDate')}`,
    cooperationEndDate: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.cooperationEndDate')}`,
    status: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.status')}`,
    customFields: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.customFields')}`,
    salary: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.salary')}`,
    salaryType: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.salaryType')}`,
    salaryComment: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.salaryComment')}`,
    internationalPassScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.internationalPassScan')}`,
    passScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.passScan')}`,
    idCardFaceScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.idCardFaceScan')}`,
    idCardBackScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.idCardBackScan')}`,
    permitFaceScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitFaceScan')}`,
    permitBackScan: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.permitBackScan')}`,
    docs: `${t('user.info')} > ${t('user.docsFields')}`,
    medicalInsurance: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.medicalInsurance')}`,
    birthPlace: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.birthPlace')}`,
    familyStatus: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.familyStatus')}`,
    birthSurname: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.birthSurname')}`,
    childrenCount: `${t('user.info')} > ${t('user.employmentInfo')} > ${t('user.childrenCount')}`,
    tags: `${t('user.info')} > Tags`,
    createdAt: `${t('user.info')} > ${t('user.createdAt')}`,
    updatedAt: `${t('user.info')} > ${t('user.updatedAt')}`,
    businessName: `${t('user.info')} > ${t('user.businessFields')} > Obchodné meno`,
    businessStatus: `${t('user.info')} > ${t('user.businessFields')} > ${t('user.businessStatus')}`,
    businessActivities: `${t('user.info')} > ${t('user.businessActivities')}`,
    isDeleted: `${t('user.info')} > ${t('user.isDeleted')}`,
  };
  return UPDATE_SECTION_MAP;
};

export const renderValue = (key: keyof IUser, value: string | boolean | number | string[], t: (v: string) => string) => {
  if (typeof value === 'boolean' || key === 'sex') {
    return t(value?.toString());
  }
  if (key === 'tags' && Array.isArray(value)) {
    return t(value.join(', ').toUpperCase());
  }
  const isIso = !DateTime.fromISO(value?.toString()).invalidReason;
  if (isIso && value.toString().length > 4) {
    return getDateFromIso(value);
  }
  const selectKeys: (keyof IUser)[] = ['employmentType'];
  if (selectKeys.includes(key)) {
    return value ? t(`selects.${key}.${value}`) : '';
  }
  if (key === 'status') {
    return value ? t(`selects.userStatus.${value}`) : '';
  }
  if (key === 'businessStatus') {
    return value ? t(`selects.corporateBodyStatus.${value}`) : '';
  }
  if (key === 'businessActivities') {
    return (value as Array<unknown>).length;
  }
  if (key === 'familyStatus') {
    return value ? t(`selects.familyStatus.${value}`) : '';
  }
  if (key === 'role') {
    return value ? t(`selects.userRole.${value}`) : '';
  }
  return value;
};

const DocField = (props: { label: string, value: string | boolean | number }) => (
  <div className="field">
    <div className="fieldTitle">{props.label}</div>
    <Tooltip title={props?.value?.toString()}><div className="fieldValue">{props?.value}</div></Tooltip>
  </div>
);

export const renderDocs = (
  docs: Record<string, string | boolean>[],
  isNew: boolean,
  t: (v: string) => string,
) => (
  <DocItems>
    {!!docs?.length && docs.map((docItem, index) => (
      <DocItem key={index} className={isNew ? 'new' : 'old'}>
        {docItem.type === 'pass' && (
          <>
            <div className="title">{t('user.pass.pass')}</div>
            <div className="fields">
              <DocField label={t('doc.number')} value={docItem.number} />
              <DocField label={t('doc.issuerCountry')} value={docItem.country} />
              <DocField label={t('doc.dateFrom')} value={getDateFromIso(docItem.dateFrom)} />
              <DocField label={t('doc.dateTo')} value={getDateFromIso(docItem.dateTo)} />
              <DocField label={t('doc.issuedBy')} value={docItem.issuedBy} />
            </div>
          </>
        )}
        {docItem.type === 'idcard' && (
          <>
            <div className="title">{t('user.idcard.idcard')}</div>
            <div className="fields">
              <DocField label={t('doc.number')} value={docItem.number} />
              <DocField label={t('doc.issuerCountry')} value={docItem.country} />
              <DocField label={t('doc.dateFrom')} value={getDateFromIso(docItem.dateFrom)} />
              <DocField label={t('doc.dateTo')} value={getDateFromIso(docItem.dateTo)} />
            </div>
          </>
        )}
        {docItem.type === 'visa' && (
          <>
            <div className="title">{t('user.visa.visa')}</div>
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
            <div className="title">{t('user.permit.permit')}</div>
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
