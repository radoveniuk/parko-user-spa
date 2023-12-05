import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import omit from 'lodash-es/omit';
import { DateTime } from 'luxon';
import Avatar from 'v2/uikit/Avatar';
import { Table, TableBody, TableCell, TableHead, TableRow } from 'v2/uikit/Table';

import { BotIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import useViewportWidth from 'hooks/useViewportWsdth';
import { IUser, UserHistory } from 'interfaces/users.interface';
import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

import { AccountLink, NewValue, OldValue, UpdateHistoryWrapper, UpdateRow } from './styles';
import { getFieldSectionLabelMap, renderDocs, renderValue } from './utils';

type Props = {
  data: UserHistory[]
};

const UpdateHistory = ({ data }: Props) => {
  const { t } = useTranslation();
  const viewportWidth = useViewportWidth();

  const renderUpdates = (historyItem: UserHistory) => {
    const UPDATE_SECTION_MAP = getFieldSectionLabelMap(t);

    return (Object.keys(omit(historyItem.changes, ['updatedAt'])) as (keyof IUser)[]).map((key, index) => {
      const keyLabel = viewportWidth > Number(SM.replace('px', '')) ? UPDATE_SECTION_MAP[key] : UPDATE_SECTION_MAP[key].split(' > ').pop();
      if (key === 'docs') {
        return (
          <div key={index}>
            <UpdateRow>{keyLabel}:</UpdateRow>{' '}
            {renderDocs(historyItem.changes[key]?.oldValue, false, t)}
            {renderDocs(historyItem.changes[key]?.newValue, true, t)}
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
            .sort((a, b) =>
              DateTime.fromISO(b.changes.updatedAt?.newValue as string).toMillis() -
            DateTime.fromISO(a.changes.updatedAt?.newValue as string).toMillis(),
            )
            .map((historyItem, index) => (
              <TableRow key={index}>
                <TableCell>
                  {historyItem.updatedBy._id !== 'bot' && (
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
                  {historyItem.updatedBy._id === 'bot' && (
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
