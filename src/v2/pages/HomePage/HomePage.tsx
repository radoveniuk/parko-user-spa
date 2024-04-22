import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useDocumentTitle from 'v2/hooks/useDocumentTitle';
import { Button } from 'v2/uikit';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import StatusLabel from 'v2/uikit/StatusLabel';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from 'v2/uikit/Table';

import { useGetDashboardData } from 'api/query/dashboardQuery';
import { AccommodationIcon, BusinessIcon, DayoffIcon, PrepaymentIcon, RecruiterIcon, UserIcon } from 'components/icons';
import { MainMenuGrid, MainMenuLink } from 'components/Menu/MainMenu';
import { ADMIN_MENU_ITEMS, INavbarItem, MENU_ITEMS } from 'constants/menu';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IClient } from 'interfaces/client.interface';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IOrder } from 'interfaces/order.interface';
import { IPrepayment } from 'interfaces/prepayment.interface';
import { IUser } from 'interfaces/users.interface';

import { DashboardWrapper, NoDataWrapper } from './styles';

const HomePage = () => {
  const { t } = useTranslation();
  const { role, isVerified } = useAuthData();
  const { data: dashboard } = useGetDashboardData(
    { exclude: role === 'super-admin' ? ['users'] : [] },
    { enabled: ['admin', 'recruiter'].includes(role as string) },
  );

  let menuItems: INavbarItem[] = [];

  if (role === 'user' && isVerified) {
    menuItems = MENU_ITEMS;
  }
  if (['admin', 'recruiter'].includes(role as string)) {
    menuItems = ADMIN_MENU_ITEMS;
  }
  useDocumentTitle();

  return (
    <>
      {role === 'user' && (
        <>
          <MainMenuGrid>
            {menuItems.map((item) => (
              <MainMenuLink key={item.title} to={item.to}>
                <p>{t(item.title)}</p>
                {item.icon}
              </MainMenuLink>
            ))}
          </MainMenuGrid>
        </>
      )}
      {!!dashboard && ['admin', 'recruiter'].includes(role as string) && (
        <DashboardWrapper>
          <div className="cards">
            <div className="col">
              <FormCard>
                <FormCardHeader icon={<UserIcon size={24} />} title={t('navbar.profiles')}>
                  <Link to="/profiles"><Button>{t('showAll')}</Button></Link>
                </FormCardHeader>
                <FormCardBody>
                  {!!dashboard.users.length && (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('user.name')}</TableCell>
                            <TableCell>{t('user.email')}</TableCell>
                            <TableCell>{t('user.status')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboard.users.map((user: IUser) => (
                            <TableRow key={user._id}>
                              <TableCell><Link to={`/profile/${user._id}`}>{user.name} {user.surname}</Link></TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <StatusLabel className={user.status}>{user.status ? t(`selects.userStatus.${user.status}`) : ''}</StatusLabel>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </FormCardBody>
              </FormCard>
              <FormCard>
                <FormCardHeader icon={<BusinessIcon size={24} />} title={t('navbar.clients')}>
                  <Link to="/clients"><Button>{t('showAll')}</Button></Link>
                </FormCardHeader>
                <FormCardBody>
                  {!!dashboard.clients.length && (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('client.name')}</TableCell>
                            <TableCell>Sidlo</TableCell>
                            <TableCell>{t('project.status')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboard.clients.map((client: IClient) => (
                            <TableRow key={client._id}>
                              <TableCell><Link to={`/client/${client._id}`}>{client.shortName}</Link></TableCell>
                              <TableCell>{client.sidlo}</TableCell>
                              <TableCell>
                                <StatusLabel className={client.status}>{t(`selects.clientStatus.${client.status}`)}</StatusLabel>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </FormCardBody>
              </FormCard>
              <FormCard>
                <FormCardHeader icon={<RecruiterIcon size={24} />} title={t('navbar.orders')}>
                  <Link to="/orders"><Button>{t('showAll')}</Button></Link>
                </FormCardHeader>
                <FormCardBody>
                  {!!dashboard.orders.length && (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('order.name')}</TableCell>
                            <TableCell>{t('order.client')}</TableCell>
                            <TableCell>{t('order.status')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboard.orders.map((order: IOrder<true>) => (
                            <TableRow key={order._id}>
                              <TableCell><Link to={`/order/${order._id}`}>{order.name}</Link></TableCell>
                              <TableCell>{order.client.shortName}</TableCell>
                              <TableCell>
                                <StatusLabel className={order.status}>{t(`selects.orderStatus.${order.status}`)}</StatusLabel>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </FormCardBody>
              </FormCard>
            </div>
            <div className="col">
              <FormCard>
                <FormCardHeader icon={<PrepaymentIcon size={24} />} title={t('navbar.prepayments')}>
                  <Link to="/prepayments"><Button>{t('showAll')}</Button></Link>
                </FormCardHeader>
                <FormCardBody>
                  {!!dashboard.prepayments.length && (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('prepayment.user')}</TableCell>
                            <TableCell>{t('prepayment.sum')}</TableCell>
                            <TableCell>{t('prepayment.status')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboard.prepayments.map((prepayment: IPrepayment & { user: IUser }) => (
                            <TableRow key={prepayment._id}>
                              <TableCell>
                                <Link to={`/profile/${prepayment.user._id}`}>{prepayment.user.name} {prepayment.user.surname}</Link>
                              </TableCell>
                              <TableCell>{Number(prepayment.sum).toFixed(2)}€</TableCell>
                              <TableCell>
                                <StatusLabel className={prepayment.status}>{t(`selects.prepaymentStatus.${prepayment.status}`)}</StatusLabel>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </FormCardBody>
              </FormCard>
              <FormCard>
                <FormCardHeader icon={<DayoffIcon size={24} />} title={t('navbar.daysoff')}>
                  <Link to="/daysoff"><Button>{t('showAll')}</Button></Link>
                </FormCardHeader>
                <FormCardBody>
                  {!!dashboard.daysoff.length && (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('dayoff.user')}</TableCell>
                            <TableCell>{t('dayoff.dateStart')}</TableCell>
                            <TableCell>{t('dayoff.dateEnd')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboard.daysoff.map((dayoff: IDayOff & { user: IUser }) => (
                            <TableRow key={dayoff._id}>
                              <TableCell>
                                <Link to={`/profile/${dayoff.user._id}`}>{dayoff.user.name} {dayoff.user.surname}</Link>
                              </TableCell>
                              <TableCell>{getDateFromIso(dayoff.dateStart)}</TableCell>
                              <TableCell>{getDateFromIso(dayoff.dateEnd)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </FormCardBody>
              </FormCard>
              <FormCard>
                <FormCardHeader icon={<AccommodationIcon size={24} />} title={t('navbar.accommodation')}>
                  <Link to="/accommodation"><Button>{t('showAll')}</Button></Link>
                </FormCardHeader>
                <FormCardBody>
                  {!!dashboard.accommodations.length && (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('accommodation.owner')}</TableCell>
                            <TableCell>{t('accommodation.adress')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboard.accommodations.map((accommodation: IAccommodation) => (
                            <TableRow key={accommodation._id}>
                              <TableCell>{accommodation.owner}</TableCell>
                              <TableCell>{accommodation.adress}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </FormCardBody>
              </FormCard>
            </div>
          </div>
        </DashboardWrapper>
      )}
      {!isVerified && <NoDataWrapper>{t('youNotVerified')}</NoDataWrapper>}
    </>
  );
};

export default HomePage;
