
import { IClient } from 'interfaces/client.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

export const SB_MOCK_USER: IUser = {
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
  project: {
    _id: '62d93122dfabe1cfa48057de',
    name: 'Hyza',
    client: {
      _id: '63a176f8206ee9a3f8bdd90a',
      name: 'HYZA a.s.',
    } as IClient,
    stages: [],
  } as unknown as IProject,
  otherScans: [],
  sex: 'male',
  blocked: false,
  notes: '',
  recruiter: {
    _id: '6377a624bbb34cf2b779fdf7',
    fullname: 'Hanna Terentieva',
  },
  source: 'Google ADS',
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
  hasMedicalExamination: false,
  bankName: '',
  SWIFT: '',
  cooperationEndDate: '',
  customFields: {},
  salary: '',
  salaryType: '',
  salaryComment: '',
  internationalPassScan: '',
  idCardFaceScan: '',
  idCardBackScan: '',
  permitBackScan: '',
  medicalInsurance: '',
  birthPlace: '',
  familyStatus: '',
  birthSurname: '',
  childrenCount: 0,
  createdBy: null,
  updatedBy: null,
  workTypes: [],
  employmentRecruiter: null,
};

export const SB_MOCK_CLIENT: IClient = {
  _id: '63a176f8206ee9a3f8bdd90a',
  name: 'HYZA a.s.',
  ICO: '31562540',
  DIC: '2020445405',
  ICDPH: 'SK2020445405',
  sidlo: 'Odbojárov 2279/37 955 92 Topoľčany',
  websiteUrl: 'https://www.hyza.sk/',
  contactPerson: 'Mgr. Mária Trenčianská',
  contactPersonPosition: 'HR specialist',
  email: 'maria.trencianska@hyza.sk',
  phone: '+421 901 919 322',
  cooperationStartDate: '2021-11-01',
  status: 'active',
  createdAt: '2022-12-20T08:48:56.557Z',
  updatedAt: '2022-12-20T08:48:56.557Z',
  cooperationEndDate: '',
  managers: [
    {
      _id: '6377a624bbb34cf2b779fdf7',
      name: 'Hanna',
      surname: 'Terentieva',
    },
    {
      _id: '64c8ef39db7ec89143e7232f',
      name: 'Zuzana',
      surname: 'Kušnieriková',
    },
  ],
  shortName: '',
  comment: '',
};
