import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash-es';
import omit from 'lodash-es/omit';
import { DateTime } from 'luxon';
import Avatar from 'v2/uikit/Avatar';
import { Table, TableBody, TableCell, TableHead, TableRow } from 'v2/uikit/Table';

import { BotIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import useViewportWidth from 'hooks/useViewportWsdth';
import { MongoHistory } from 'interfaces/base.types';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';
import { TB } from 'theme/sizeBreakpoints';

import { AccountLink, NewValue, OldValue, UpdateHistoryWrapper, UpdateRow } from './styles';
import { getFieldSectionLabelMap, renderDocs, renderValue } from './utils';

type Props = {
  data: MongoHistory<IUser>[]
};

const UpdateHistory = ({ data }: Props) => {
  const { t } = useTranslation();
  const viewportWidth = useViewportWidth();
  const queryClient = useQueryClient();

  const renderUpdates = (historyItem: MongoHistory<IUser>) => {
    const UPDATE_SECTION_MAP = getFieldSectionLabelMap(t);

    return (Object.keys(omit(historyItem.changes, ['updatedAt'])) as (keyof IUser)[])
      // .filter((key) => !!historyItem.changes[key]?.newValue)
      .map((key, index) => {
        if (!UPDATE_SECTION_MAP[key]) return '';
        const keyLabel = viewportWidth > Number(TB.replace('px', '')) ? UPDATE_SECTION_MAP[key] : UPDATE_SECTION_MAP?.[key]?.split(' > ').pop();
        if (key === 'docs') {
          return (
            <div key={index}>
              <UpdateRow>{keyLabel}:</UpdateRow>{' '}
              {renderDocs(historyItem.changes[key]?.oldValue, false, t)}
              {renderDocs(historyItem.changes[key]?.newValue, true, t)}
            </div>
          );
        }
        if (key === 'project') {
          const projects: IProject[] | undefined = queryClient.getQueryData(['projects', JSON.stringify({})]);
          const oldProject = projects?.find(projItem => projItem._id === historyItem.changes[key]?.oldValue);
          const newProject = projects?.find(projItem => projItem._id === historyItem.changes[key]?.newValue);

          return (
            <div key={index}>
              <UpdateRow>{keyLabel}:</UpdateRow>{' '}
              <OldValue>{renderValue(key, oldProject?.name || '', t)}</OldValue>{' '}
              <NewValue>{renderValue(key, newProject?.name || '', t)}</NewValue>
            </div>
          );
        }
        if (key === 'recruiter') {
          const recruiters: IUser[] | undefined = queryClient.getQueryData(['users', JSON.stringify({ role: 'recruiter' })]);
          console.log(recruiters);

          const oldRecruiter = recruiters?.find(userItem => userItem._id === historyItem.changes[key]?.oldValue);
          const newRecruiter = recruiters?.find(userItem => userItem._id === historyItem.changes[key]?.newValue);

          return (
            <div key={index}>
              <UpdateRow>{keyLabel}:</UpdateRow>{' '}
              <OldValue>{renderValue(key, `${oldRecruiter?.name || ''} ${oldRecruiter?.surname || ''}`, t)}</OldValue>{' '}
              <NewValue>{renderValue(key, `${newRecruiter?.name || ''} ${newRecruiter?.surname || ''}`, t)}</NewValue>
            </div>
          );
        }
        return (
          <div key={index}>
            <UpdateRow>{keyLabel}:</UpdateRow>{' '}
            <OldValue>{renderValue(key, historyItem.changes[key]?.oldValue, t)}</OldValue>{' '}
            <NewValue>{renderValue(key, historyItem.changes[key]?.newValue, t)}</NewValue>
          </div>
        );
      });
  };

  return (
    <UpdateHistoryWrapper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('userHistory.updatedBy')}</TableCell>
            <TableCell>{t('userHistory.updatedAt')}</TableCell>
            <TableCell>{t('userHistory.updates')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .filter(historyItem => !isEmpty(omit(historyItem.changes, ['updatedAt', 'password', 'projectStages', 'otherScans'])))
            .sort((a, b) =>
              DateTime.fromISO(b.changes.updatedAt?.newValue as string).toMillis() -
              DateTime.fromISO(a.changes.updatedAt?.newValue as string).toMillis(),
            )
            .map((historyItem, index) => (
              <TableRow key={index}>
                <TableCell>
                  {!!historyItem?.updatedBy && historyItem.updatedBy._id !== 'bot' && (
                    <Link to={`/profile/${historyItem.updatedBy._id}`}>
                      <AccountLink>
                        <Avatar
                          sx={{ bgcolor: themeConfig.palette.primary.light }}
                          username={`${historyItem.updatedBy.name} ${historyItem.updatedBy.surname}`}
                        />
                        {historyItem.updatedBy.name} {historyItem.updatedBy.surname}
                      </AccountLink>
                    </Link>
                  )}
                  {!!historyItem?.updatedBy && historyItem.updatedBy._id === 'bot' && (
                    <AccountLink>
                      <Avatar sx={{ bgcolor: themeConfig.palette.secondary.main }}><BotIcon color="#2b2b2b" /></Avatar>
                      Parko bot
                    </AccountLink>
                  )}
                </TableCell>
                <TableCell className="date">{getDateFromIso(historyItem.changes.updatedAt?.newValue, 'dd.MM.yyyy HH:mm:ss')}</TableCell>
                <TableCell className="description">{renderUpdates(historyItem)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </UpdateHistoryWrapper>
  );
};

export default UpdateHistory;
