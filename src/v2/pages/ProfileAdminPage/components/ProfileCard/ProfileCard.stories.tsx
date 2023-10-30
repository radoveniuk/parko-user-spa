import React from 'react';
import { I18nextProvider } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';
import { TabsContainer } from 'v2/uikit/Tabs';

import { IClient } from 'interfaces/client.interface';
import { IWorkHistoryLog } from 'interfaces/history.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import ProfileCard from './ProfileCard';

const MOCK_USER: Partial<IUser> = {
  _id: '64184af1ddf0117fd7551a12',
  email: 'shirinov.mahmud@gmail.com',
  name: 'Shirinov',
  surname: 'Mahmud',
  password: '$2b$10$WH9XhFEM8rS6yWcYkkbJpO2xB.5GI2OgO/58VEPxxUWuA0yynyDIK',
  phone: '+998972886100',
  birthDate: '1986-11-13',
  country: 'Kazachstan',
  city: 'Samarkand',
  adress: 'Obi-rakhmat ave. 3 house 1',
  zip: '',
  passNumber: 'FA3313710',
  hasPermit: false,
  permitType: 'zamestnanie',
  permitExpire: '',
  rodneCislo: '',
  IBAN: '',
  ICO: '',
  tshortSize: '',
  pantsSize: '',
  shoesSize: '',
  role: 'user',
  project: {
    _id: '62d93122dfabe1cfa48057de',
    name: 'Hyza',
    client: {
      _id: '63a176f8206ee9a3f8bdd90a',
      name: 'HYZA a.s.',
    } as IClient,
    stages: [],
  } as unknown as IProject,
  otherScans: [
    {
      _id: '641855ddddf0117fd7551a89',
      path: 'bucket/01488af850a1b159b424b67a91a79856',
      originalname: 'Mahmud Shirinov -zmluva',
      ext: 'pdf',
      metadata: {
        comment: 'Mahmud Shirinov -zmluva',
        type: 'other',
      },
      createdAt: '2023-03-20T12:47:25.050Z',
      updatedAt: '2023-03-20T12:47:25.050Z',
      __v: 0,
    },
    {
      _id: '642ab91db485c3639dd74f9f',
      path: 'bucket/779021858ac0a481b7286890c534261f',
      originalname: 'Mahmud Shirinov - potvrdenie CP',
      ext: 'pdf',
      metadata: {
        comment: 'Potvrdenie CP  ',
        type: 'other',
      },
      createdAt: '2023-04-03T11:31:41.907Z',
      updatedAt: '2023-04-03T11:31:41.907Z',
      __v: 0,
    },
    {
      _id: '642bd7639176b102e5266234',
      path: 'bucket/6a50f80b7bf9dc81bf3efac94c348f27',
      originalname: 'Mahmud Shirinov žiadost',
      ext: 'pdf',
      metadata: {
        comment: 'žiadosť CP ',
        type: 'other',
      },
      createdAt: '2023-04-04T07:53:07.721Z',
      updatedAt: '2023-04-04T07:53:07.721Z',
      __v: 0,
    },
    {
      _id: '6461ec183dc2dc2274f270eb',
      path: 'bucket/34ed2809d04c7f2e7949cd121ffa423d',
      originalname: 'Mahmud Shirinov - Dodatočné údaje',
      ext: 'pdf',
      metadata: {
        comment: 'dodatočne udaje',
        type: 'other',
      },
      createdAt: '2023-05-15T08:23:52.068Z',
      updatedAt: '2023-05-15T08:23:52.068Z',
      __v: 0,
    },
  ],
  sex: 'male',
  blocked: false,
  notes: '',
  recruiter: {
    name: 'Hanna',
    surname: 'Terentieva',
  },
  source: 'Google ads',
  permitStartDate: '',
  DIC: '',
  permitAdress: '',
  permitDepartment: '',
  permitNumber: '',
  projectStages: null,
  createdAt: '2023-03-20T12:00:49.348Z',
  updatedAt: '2023-09-05T12:56:52.170Z',
  cooperationStartDate: '2023-04-17',
  cooperationType: 'Trvalý pracovný pomer',
  employmentType: 'fullTime',
  position: 'Operátor výroby',
  status: 'hired',
  passScan: {
    _id: '641855c3ddf0117fd7551a87',
    path: 'bucket/f39d6c39e54155a4adc4918efbba2b30',
    originalname: 'Mahmud Shirinov - pass',
    ext: 'pdf',
    metadata: {
      comment: '',
      type: 'passScan',
    },
  },
  permitFaceScan: {
    _id: '64638b664033262a3dac86c3',
    path: 'bucket/972371e90df70f30aa8c4724d8abc02d',
    originalname: 'Shirinov Mahmud - pobytova karta',
    ext: 'pdf',
    metadata: {
      comment: '',
      type: 'permitFaceScan',
    },
  },
  nickname: 'Shirinov_Mahmud',
};

const MOCK_WORK_HISTORY: IWorkHistoryLog[] = [
  {
    dateFrom: '2021-10-10',
    dateTo: '2022-10-10',
    user: '64184af1ddf0117fd7551a12',
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
    user: '64184af1ddf0117fd7551a12',
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
    user: '64184af1ddf0117fd7551a12',
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
};

export default meta;

type Story = StoryObj<typeof ProfileCard>;

export const Example: Story = {
  args: {
    user: MOCK_USER,
    workHistory: MOCK_WORK_HISTORY,
  },
  render: (args) => (
    <I18nextProvider i18n={i18n}>
      <TabsContainer>
        <ProfileCard {...args} />
      </TabsContainer>
    </I18nextProvider>
  ),
};
