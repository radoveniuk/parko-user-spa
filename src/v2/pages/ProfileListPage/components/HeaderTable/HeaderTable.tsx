import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { pick } from 'lodash-es';
import ProfileFormDialog from 'v2/components/ProfileFormDialog';
import { Button, Divider, Menu, MenuItem, Stack } from 'v2/uikit';
import DialogFullscreen from 'v2/uikit/DialogFullscreen';
import IconButton from 'v2/uikit/IconButton';

import { useCreateUserMutation } from 'api/mutations/userMutation';
import { useGetProjects } from 'api/query/projectQuery';
import { ArrowDownIcon, FilterIcon, PlusIcon, ThreeDotsIcon } from 'components/icons';
import { FilterAutocomplete, useFilters } from 'components/shared/Filters';
import { USER_STATUSES } from 'constants/statuses';
import { DEFAULT_PASS } from 'constants/user';
import { DYNAMIC_FIELDS, TRANSLATED_FIELDS } from 'constants/userCsv';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import { useExportData } from 'hooks/useExportData';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { AnyObject } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';

import { FiltersWrapper, HeaderWrapper } from './styles';

const HeaderTable = ({ selectedItems, setSelectedItems, setOpenPrintDialog, data, activeCols, customFields }: any) => {
  const { t, i18n } = useTranslation();

  // filters
  const { data: projects = [] } = useGetProjects();
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');

  const colsToExport = useMemo(() => {
    const result = activeCols.map((col: any) => {
      if (isMongoId(col)) {
        const customField = customFields.find((item: any) => item._id === col);
        return customField?.names[i18n.language] || col;
      }
      return col.replace('user.', '');
    });
    return ['name', ...result];
  }, [activeCols, customFields, i18n.language]);

  const usersToExport = useMemo(() => selectedItems.map((item: any) => {
    let newItem: AnyObject = { ...item };
    Object.keys(item).forEach((userKey) => {
      if (userKey === 'name') {
        newItem = { ...newItem, name: `${item.name} ${item.surname}` };
      }
      if (typeof newItem[userKey] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(newItem[userKey])) {
        newItem[userKey] = getDateFromIso(newItem[userKey]);
      }
      if (TRANSLATED_FIELDS.includes(userKey as keyof IUser)) {
        if (typeof newItem[userKey] === 'boolean') {
          newItem[userKey] = t(newItem[userKey]);
        } else if (newItem[userKey]) {
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
        }
      }
      if (DYNAMIC_FIELDS.includes(userKey as keyof IUser)) {
        if (userKey === 'project') {
          newItem[userKey] = newItem[userKey]?.name;
        }
        if (userKey === 'recruiter') {
          newItem[userKey] = newItem[userKey] ? `${newItem[userKey]?.name} ${newItem[userKey]?.surname}` : '';
        }
      }
    });

    customFields.forEach((customField: any) => {
      const customFieldValue = newItem.customFields?.[customField._id];
      newItem[customField.names[i18n.language]] = customFieldValue;
      if (typeof customFieldValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(customFieldValue)) {
        newItem[customField.names[i18n.language]] = getDateFromIso(customFieldValue);
      }
      if (typeof customFieldValue === 'boolean') {
        newItem[customField.names[i18n.language]] = t(`${customFieldValue}`);
      }
    });

    return pick(newItem, colsToExport) as Partial<IUser>;
  }), [colsToExport, customFields, i18n.language, selectedItems, t]);

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
  const { filtersState } = useFilters();

  const createNewProfileHandler = (data: Partial<IUser>) => {
    setOpenNewProfile(false);
    const recruiter = data.recruiter as IUser | null;
    const values = { ...data, recruiter: recruiter?._id || null, password: DEFAULT_PASS };
    const queryKey = ['users', JSON.stringify(filtersState)];
    queryClient.setQueryData(queryKey, [values, ...(queryClient.getQueryData(queryKey) as IUser[])]);
    const [, ...oldItems] = queryClient.getQueryData(queryKey) as IUser[];
    createUserMutation.mutateAsync(values)
      .then((res) => {
        queryClient.setQueryData(queryKey, [res, ...oldItems]);
      })
      .catch(() => {
        queryClient.setQueryData(queryKey, oldItems);
      });
  };

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('profilesPage.users')}: {data.length}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <IconButton className="small-btn" onClick={() => void setOpenMobileFilters(true)}><FilterIcon size={25} /></IconButton>
          <div className="link">
            <IconButton className="small-btn primary" onClick={() => void setOpenNewProfile(true)}><PlusIcon size={25} /></IconButton>
            <Button className="big-btn" onClick={() => void setOpenNewProfile(true)}>
              {t('profilesPage.new_user')}
            </Button>
          </div>
          <Menu
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
            <Link to="/import-profiles">
              <MenuItem>
                {t('user.import')}
              </MenuItem>
            </Link>
            <MenuItem disabled={!selectedItems.length} onClick={() => void exportData('xlsx')}>
              {t('user.export')}
            </MenuItem>
          </Menu>
        </Stack>
        <DialogFullscreen title={t('filters')} open={openMobileFilters} onClose={() => void setOpenMobileFilters(false)}>
          <FiltersWrapper>
            <FilterAutocomplete
              multiple
              filterKey="projects"
              label={t('user.project')}
              options={projects}
              labelKey="name"
              theme="gray"
            />
            <FilterAutocomplete
              multiple
              filterKey="statuses"
              label={t('user.status')}
              options={translatedStatuses}
              labelKey="label"
              theme="gray"
            />
            <Button onClick={() => void setOpenMobileFilters(false)} variant="contained" className="apply-filter-btn">{t('user.approve')}</Button>
          </FiltersWrapper>
        </DialogFullscreen>
      </HeaderWrapper>
      <ProfileFormDialog
        open={openNewProfile}
        onClose={() => void setOpenNewProfile(false)}
        onSave={createNewProfileHandler}
      />
    </>
  );
};

export default memo(HeaderTable);
