import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';
import { SnackbarProvider } from 'notistack';
import { TabPanel, TabsContainer } from 'v2/uikit/Tabs';

import { SB_MOCK_USER } from 'constants/storybookData';
import AuthProvider from 'contexts/AuthContext';

import ProfileCard, { IWorkHistoryLog } from './ProfileCard';

const mockData = [
  {
    url: '/api/users?role=recruiter',
    method: 'GET',
    status: 200,
    delay: 500,
    response: {
      data: [
        {
          docs: [],
          history: [],
          createdBy: null,
          updatedBy: null,
          _id: '64c8ef39db7ec89143e7232f',
          email: 'z.kusnierikova@parko.sk',
          name: 'Zuzana',
          surname: 'Kušnieriková',
          password: '$2b$10$.gm6UZGyl7kJsCW.kIEeUOdM6mKvaQ5HZaquRrTsqbwT/i./puV3.',
          phone: '+421 904 009 454',
          birthDate: '1998-09-13',
          country: 'Slovensko',
          city: 'Hruštín',
          adress: 'Kút 503',
          zip: '02952',
          passNumber: 'NG202913',
          permitType: '',
          permitExpire: '',
          rodneCislo: '',
          IBAN: 'SK88 7500 0000 0040 2708 8389',
          ICO: '',
          tshortSize: '',
          pantsSize: '',
          shoesSize: '',
          role: 'recruiter',
          project: {
            _id: '637b51e5bbb34cf2b77a0062',
            name: 'Interní zamestnanci ',
          },
          otherScans: [
            '64ca02814033262a3dad3c04',
            '64ca02cb4033262a3dad3c0a',
            '65004675ff49ab8bc5142e52',
            '65004684ff49ab8bc5142e54',
          ],
          sex: 'female',
          blocked: false,
          notes: '',
          recruiter: null,
          source: '',
          permitStartDate: '',
          DIC: '',
          permitAdress: '',
          permitDepartment: '',
          permitNumber: '',
          createdAt: '2023-08-01T11:40:41.627Z',
          updatedAt: '2023-11-21T13:05:48.503Z',
          __v: 0,
          cooperationType: 'Trvalý pracovný pomer',
          employmentType: 'fullTime',
          position: 'Administratívny pracovník',
          status: 'hired',
          nickname: 'Zuzana_Kušnieriková',
          cooperationStartDate: '2023-08-01',
        },
        {
          docs: [],
          history: [],
          createdBy: null,
          updatedBy: null,
          _id: '6377a69f28769554b127312a',
          email: 'bobrishev.vlad@gmail.com',
          name: 'Vladyslav',
          surname: 'Bobryshev',
          password: '$2b$10$4hv/4rvnMWOY1w5RaczmwuZVq458MGStGjpXMb2b65eaxsZwOHfQa',
          phone: '+421 951 671 396',
          birthDate: '2002-11-19',
          country: 'Ukrajina',
          city: 'Kyiv',
          adress: 'Marshala Malinovskoho 4V',
          zip: '03189',
          passNumber: 'FU507931',
          hasPermit: true,
          permitType: 'štúdium',
          permitExpire: '2024-08-31',
          rodneCislo: '021119/9230',
          IBAN: 'SK54 1100 0000 0029 3055 9264',
          ICO: '',
          tshortSize: '',
          pantsSize: '',
          shoesSize: '',
          role: 'recruiter',
          otherScans: [
            '637b59a0bbb34cf2b77a01e5',
            '637b59b7bbb34cf2b77a01e7',
            '637b59d4bbb34cf2b77a01e9',
            '637b59f228769554b1273508',
            '637b5a7c28769554b127350a',
            '637b5a8f28769554b127350c',
            '6388c76cbbb34cf2b77a961e',
            '63b450400a38abd2c8662f56',
            '63da5561aad684e84bf68c06',
            '643508bfd79894551485830f',
            '643508c3d798945514858311',
            '64940b459f2e0b971a97165e',
          ],
          sex: 'male',
          blocked: false,
          notes: '',
          recruiter: null,
          source: 'Referal',
          permitStartDate: '2021-11-27',
          hasMedicalExamination: true,
          DIC: '',
          permitAdress: '',
          permitDepartment: '',
          permitNumber: '',
          position: 'Administratívny pracovník',
          cooperationStartDate: '2022-09-13',
          cooperationEndDate: '2023-09-13',
          cooperationType: 'Brigáda',
          createdAt: '2022-11-18T15:37:03.074Z',
          updatedAt: '2023-09-05T12:56:06.821Z',
          __v: 0,
          employmentType: 'sideJob',
          project: {
            _id: '637b51e5bbb34cf2b77a0062',
            name: 'Interní zamestnanci ',
          },
          status: 'hired',
          nickname: 'Vladyslav_Bobryshev',
        },
        {
          docs: [],
          history: [],
          createdBy: null,
          updatedBy: null,
          _id: '6377a624bbb34cf2b779fdf7',
          email: 'terentevaa42@gmail.com',
          name: 'Hanna',
          surname: 'Terentieva',
          password: '$2b$10$fNCmC4hIw52CfMKz/akZbeSPYyGrrc8CGfFS5sd591vlfFNq0uWti',
          phone: '+421 917 064 304',
          birthDate: '1994-05-10',
          country: 'Ukrajina',
          city: 'Zeleny Haj',
          adress: 'Ostapa Vyshni 50',
          zip: '60307',
          passNumber: 'FK097784',
          permitType: 'zamestnanie',
          permitExpire: '2024-05-24',
          rodneCislo: '9445510/9169',
          IBAN: 'SK34 0200 0000 0044 9513 3953',
          ICO: '',
          tshortSize: '',
          pantsSize: '',
          shoesSize: '',
          role: 'recruiter',
          otherScans: [
            '63a091ec206ee9a3f8bdd5f1',
            '63ac80f2eb462412d85746fc',
            '63ac810feb462412d85746fe',
            '63ac8154eb462412d8574700',
            '63ad6c64eb462412d85748a3',
            '63da554baad684e84bf68c04',
            '643508d2d79894551485832b',
            '643508d6d79894551485832d',
            '645de9b14033262a3dac6017',
            '645e17e14033262a3dac6034',
            '64940b2f4033262a3dacde94',
            '64cba6804033262a3dad4578',
          ],
          sex: 'female',
          blocked: true,
          notes: '',
          recruiter: null,
          source: '',
          permitStartDate: '2022-06-07',
          DIC: '',
          permitAdress: '',
          permitDepartment: '',
          permitNumber: '',
          position: 'Administratívny pracovník',
          cooperationStartDate: '2023-01-02',
          cooperationEndDate: '',
          cooperationType: 'Trvalý pracovný pomer',
          createdAt: '2022-11-18T15:35:00.951Z',
          updatedAt: '2023-09-05T12:56:06.786Z',
          __v: 0,
          employmentType: 'fullTime',
          project: {
            _id: '637b51e5bbb34cf2b77a0062',
            name: 'Interní zamestnanci ',
          },
          status: 'hired',
          hasMedicalExamination: true,
          hasPermit: true,
          internationalPassScan: '637b60f4bbb34cf2b77a0214',
          permitFaceScan: '646e036a5b768f528c57ba45',
          passScan: null,
          projectStages: null,
          salary: '',
          salaryComment: '',
          salaryType: 'month',
          nickname: 'Hanna_Terentieva',
        },
      ],
    },
  },
];

const MOCK_WORK_HISTORY: IWorkHistoryLog[] = [
  {
    dateFrom: '2021-10-10',
    dateTo: '2022-10-10',
    project: {
      _id: '1hghdfaasyuk',
      name: 'Sample sro',
      client: {
        name: 'Client 1',
      },
    },
    position: 'Employee',
  },
  {
    dateFrom: '2022-10-10',
    dateTo: '2023-07-08',
    project: {
      _id: '1hghdfaasyuefsck',
      name: 'Parko sro',
      client: {
        name: 'Client 2',
      },
    },
    position: 'Employee',
  },
  {
    dateFrom: '2023-07-08',
    project: {
      _id: '62d93122dfabe1cfa48057de',
      name: 'Hyza',
      client: {
        _id: '63a176f8206ee9a3f8bdd90a',
        name: 'HYZA a.s.',
      },
    },
    position: 'Employee',
  },
];
const meta: Meta<typeof ProfileCard> = {
  component: ProfileCard,
  argTypes: {
    onChange: { action: 'onChange' },
  },
};

export default meta;

type Story = StoryObj<typeof ProfileCard>;

export const Example: Story = {
  args: {
    data: SB_MOCK_USER,
    workHistory: MOCK_WORK_HISTORY,
  },
  parameters: { mockData },
  render: (args) => (
    <SnackbarProvider maxSnack={1}>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <TabsContainer>
              <div style={{ display: 'flex' }}>
                <ProfileCard {...args} />
                <TabPanel index={0}>Profile</TabPanel>
                <TabPanel index={1}>Info</TabPanel>
                <TabPanel index={2}>Cooperation</TabPanel>
                <TabPanel index={3}>History</TabPanel>
              </div>
            </TabsContainer>
          </I18nextProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  ),
};
