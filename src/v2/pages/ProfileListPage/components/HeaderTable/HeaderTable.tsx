import React, { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import cloneDeep from 'lodash-es/cloneDeep';
import pick from 'lodash-es/pick';
import set from 'lodash-es/set';
import { FilterAutocomplete, HeaderFilterButton, useFilters } from 'v2/components/Filters';
import ProfileFormDialog from 'v2/components/ProfileFormDialog';
import { Button, Divider, Menu, MenuItem } from 'v2/uikit';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';
import Skeleton from 'v2/uikit/Skeleton';

import { useCreateUserMutation } from 'api/mutations/userMutation';
import { ArrowDownIcon, ExcelIcon, FilterIcon, PlusIcon, ThreeDotsIcon, UploadIcon } from 'components/icons';
import { DEFAULT_PASS } from 'constants/user';
import { DYNAMIC_FIELDS } from 'constants/userCsv';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import { useExportData } from 'hooks/useExportData';
import { AnyObject } from 'interfaces/base.types';
import { ICustomFormFieldSectionBinding } from 'interfaces/form.interface';
import { IRole } from 'interfaces/role.interface';
import { IUser } from 'interfaces/users.interface';

import { FiltersWrapper } from './styles';

type Props = {
  selectedItems: IUser[],
  setSelectedItems: (v: IUser[]) => void,
  setOpenPrintDialog: (v: boolean) => void,
  data: IUser[], activeCols: string[],
  customFields: ICustomFormFieldSectionBinding<true>[],
  loading?: boolean,
  detailedFilters?: AnyObject;
};

const HeaderTable = ({ selectedItems, setSelectedItems, setOpenPrintDialog, data, activeCols, customFields, loading, detailedFilters }: Props) => {
  const { t, i18n } = useTranslation();
  const { permissions } = useAuthData();

  const colsToExport = useMemo(() => {
    const result = activeCols.map((col) => {
      if (isMongoId(col)) {
        const customField = customFields.find((item: AnyObject) => item._id === col);
        return customField?.field.names[i18n.language] || col;
      }
      return col.replace('user.', '');
    });
    return ['name', ...result];
  }, [activeCols, customFields, i18n.language]);

  const usersToExport = useMemo(() => selectedItems.map((item: AnyObject) => {
    let newItem: AnyObject = cloneDeep(item);

    const visa = newItem.docs.find((doc: AnyObject) => doc.type === 'visa');
    set(visa, 'dateFrom', getDateFromIso(visa?.dateFrom));
    set(visa, 'dateTo', getDateFromIso(visa?.dateTo));

    const permit = newItem.docs.find((doc: AnyObject) => doc.type === 'permit');
    set(permit, 'dateFrom', getDateFromIso(permit?.dateFrom));
    set(permit, 'dateTo', getDateFromIso(permit?.dateTo));
    set(permit, 'goal', permit?.goal ? t(`selects.permitType.${permit.goal}`) : '');
    set(permit, 'isMedicalCheck', typeof permit?.isMedicalCheck === 'boolean' ? t(permit?.isMedicalCheck.toString()) : '');

    const longtermstay = newItem.docs.find((doc: AnyObject) => doc.type === 'longtermstay');
    set(longtermstay, 'dateFrom', getDateFromIso(longtermstay?.dateFrom));
    set(longtermstay, 'dateTo', getDateFromIso(longtermstay?.dateTo));

    const idcard = newItem.docs.find((doc: AnyObject) => doc.type === 'idcard');
    set(idcard, 'dateFrom', getDateFromIso(idcard?.dateFrom));
    set(idcard, 'dateTo', getDateFromIso(idcard?.dateTo));

    const pass = newItem.docs.find((doc: AnyObject) => doc.type === 'pass');
    set(pass, 'dateFrom', getDateFromIso(pass?.dateFrom));
    set(pass, 'dateTo', getDateFromIso(pass?.dateTo));

    set(newItem, 'visa', visa);
    set(newItem, 'permit', permit);
    set(newItem, 'idcard', idcard);
    set(newItem, 'pass', pass);

    Object.keys(newItem).forEach((userKey) => {
      if (userKey === 'name') {
        newItem = { ...newItem, name: `${newItem.fullname}` };
      }
      if (typeof newItem[userKey] === 'string' &&
       (/^\d{4}-\d{2}-\d{2}$/.test(newItem[userKey]) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/.test(newItem[userKey]))) {
        newItem[userKey] = getDateFromIso(newItem[userKey]);
      }
      if (typeof newItem[userKey] === 'boolean') {
        newItem[userKey] = t(newItem[userKey]);
      }
      if (userKey === 'role') {
        newItem[userKey] = t(`selects.userRole.${newItem[userKey]}`);
      }
      if (userKey === 'status') {
        newItem[userKey] = t(`selects.userStatus.${newItem[userKey]}`);
      }
      if (userKey === 'permitType') {
        newItem[userKey] = t(`selects.permitType.${newItem[userKey]}`);
      }
      if (userKey === 'sex') {
        newItem[userKey] = t(newItem[userKey]);
      }
      if (userKey === 'familyStatus') {
        newItem[userKey] = t(`selects.familyStatus.${newItem[userKey]}`);
      }
      if (DYNAMIC_FIELDS.includes(userKey as keyof IUser)) {
        if (userKey === 'project') {
          newItem[userKey] = newItem[userKey]?.name;
        }
        if (userKey === 'recruiter') {
          newItem[userKey] = newItem[userKey] ? `${newItem[userKey]?.fullname}` : '';
        }
      }
    });

    return pick(newItem, colsToExport) as Partial<IUser>;
  }), [colsToExport, selectedItems, t]);

  const exportData = useExportData({
    data: usersToExport,
    colsToExport: colsToExport,
    cols: colsToExport,
    entity: 'user',
  });

  const [openMobileFilters, setOpenMobileFilters] = useState(false);

  const [openNewProfile, setOpenNewProfile] = useState(false);
  const createUserMutation = useCreateUserMutation();
  const queryClient = useQueryClient();
  const { filtersState, removeFilter } = useFilters();

  const createNewProfileHandler = (data: Partial<IUser>) => {
    setOpenNewProfile(false);
    const recruiter = data.recruiter as IUser | null;
    const rolesToIds = (roles: IRole[]) => roles?.map(role => (role as unknown as IRole)._id);
    const values = {
      ...data,
      recruiter: recruiter?._id || null,
      password: DEFAULT_PASS,
      status: 'candidate',
      roles: rolesToIds(data.roles || []),
    };
    const queryKey = ['users', JSON.stringify(filtersState)];
    const profile = { ...values, roles: data.roles };
    queryClient.setQueryData(
      queryKey,
      [{ ...profile, _id: createId(), fullname: `${profile.name} ${profile.surname}` }, ...(queryClient.getQueryData(queryKey) as IUser[])],
    );
    const [, ...oldItems] = queryClient.getQueryData(queryKey) as IUser[];
    createUserMutation.mutateAsync(values)
      .then((res) => {
        queryClient.setQueryData(queryKey, [{ ...profile, _id: res._id, fullname: res.fullname }, ...oldItems]);
      })
      .catch(() => {
        queryClient.setQueryData(queryKey, oldItems);
      });
  };

  // IsInternal filter
  const toggleInternalFilter = useCallback(() => {
    removeFilter('clients');
  }, [removeFilter]);

  return (
    <>
      <ListTableHeader
        classNames={{ title: 'bold counter' }}
        title={(
          <>
            {t('profilesPage.users')}: {!loading ? data.length : <Skeleton width={50} height={18} />}
            {permissions.includes('internal:read') && (
              <>
                <HeaderFilterButton
                  filterKey="isInternal"
                  filterValue="false"
                  onClick={toggleInternalFilter}
                  label={t('user.externals')}
                />
                <HeaderFilterButton
                  filterKey="isInternal"
                  filterValue="true"
                  onClick={toggleInternalFilter}
                  label={t('user.internals')}
                />
              </>
            )}
          </>
        )}
      >
        <IconButton className="small-btn" onClick={() => void setOpenMobileFilters(true)}><FilterIcon size={25} /></IconButton>
        {permissions.includes('users:create') && (
          <div className="link">
            <IconButton className="small-btn primary" onClick={() => void setOpenNewProfile(true)}><PlusIcon size={25} /></IconButton>
            <Button className="big-btn" onClick={() => void setOpenNewProfile(true)}>
              {t('user.new')}
            </Button>
          </div>
        )}
        <Menu
          isCloseOnMenu
          menuComponent={(
            <>
              <Button className="big-btn">
                <div className="text">{t('fastActions')}</div>
                <ArrowDownIcon className="big-icon" />
              </Button>
              <IconButton className="small-btn primary"><ThreeDotsIcon size={25} /></IconButton>
            </>
          )}
        >
          <MenuItem onClick={() => void setSelectedItems(data)}>
            {t('selectAll')}
          </MenuItem>
          <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
            {t('removeSelect')}
          </MenuItem>
          <MenuItem disabled={!selectedItems.length} onClick={() => void setOpenPrintDialog(true)}>
            {t('docsTemplates.print')}
          </MenuItem>
          <Divider />
          {permissions.includes('users:create') && (
            <Link to="/import-profiles">
              <MenuItem disabled={!permissions.includes('users:create')}>
                <UploadIcon />
                {t('user.import')}
              </MenuItem>
            </Link>
          )}
          <MenuItem style={{ color: '#1e6e43' }} disabled={!selectedItems.length} onClick={() => void exportData('xlsx')}>
            <ExcelIcon size={20} />{t('user.export')}
          </MenuItem>
        </Menu>
        <DialogFullscreen title={t('filters')} open={openMobileFilters} onClose={() => void setOpenMobileFilters(false)}>
          <FiltersWrapper>
            <FilterAutocomplete
              multiple
              filterKey="statuses"
              label={t('user.status')}
              options={detailedFilters?.statuses || []}
              getOptionLabel={(option) => `${t(`selects.userStatus.${option._id}`)} (${option.count})`}
              theme="gray"
            />
            <FilterAutocomplete
              multiple
              filterKey="clients"
              label={t('project.client')}
              options={detailedFilters?.clients || []}
              getOptionLabel={(option) => `${option.label} (${option.count})`}
              theme="gray"
            />
            <FilterAutocomplete
              multiple
              filterKey="projects"
              label={t('user.project')}
              options={detailedFilters?.projects || []}
              getOptionLabel={(option) => `${option.label} (${option.count})`}
              theme="gray"
            />
            <FilterAutocomplete
              multiple
              filterKey="employmentProjectTypes"
              label={t('user.cooperationType')}
              theme="gray"
              options={detailedFilters?.employmentProjectTypes || []}
              getOptionLabel={(option) => `${option._id} (${option.count})`}
            />
            <FilterAutocomplete
              filterKey="workTypes"
              theme="gray"
              options={detailedFilters?.workTypes || []}
              getOptionLabel={(option) => `${t(`selects.userWorkType.${option._id}`)} (${option.count})`}
              label={t('user.workTypes')}
              multiple
            />
            <FilterAutocomplete
              filterKey="recruiters"
              theme="gray"
              options={detailedFilters?.recruiters || []}
              getOptionLabel={(option) => `${option.label} (${option.count})`}
              label={t('user.recruiter')}
              multiple
            />
            <FilterAutocomplete
              filterKey="sexes"
              theme="gray"
              options={detailedFilters?.sexes || []}
              getOptionLabel={(option) => `${t(option._id)} (${option.count})`}
              label={t('user.sex')}
              multiple
            />
            <FilterAutocomplete
              filterKey="countries"
              theme="gray"
              options={detailedFilters?.countries || []}
              valueKey="_id"
              getOptionLabel={(option) => `${t(option._id)} (${option.count})`}
              label={t('user.country')}
              multiple
            />
            <Button onClick={() => void setOpenMobileFilters(false)} variant="contained" className="apply-filter-btn">{t('user.approve')}</Button>
          </FiltersWrapper>
        </DialogFullscreen>
      </ListTableHeader>
      {!!openNewProfile && (
        <ProfileFormDialog
          open={openNewProfile}
          onClose={() => void setOpenNewProfile(false)}
          onSave={createNewProfileHandler}
        />
      )}
    </>
  );
};

export default memo(HeaderTable);
