/* eslint-disable max-len */
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18n';

import BusinessInfoFormCard from './BusinessInfoFormCard';

const meta: Meta<typeof BusinessInfoFormCard> = {
  component: BusinessInfoFormCard,
  argTypes: {
    onChange: { action: 'onChange' },
  },
};

export default meta;

type Story = StoryObj<typeof BusinessInfoFormCard>;

export const Example: Story = {
  args: {
    // data: [],
  },
  parameters: {
    mockData: [
      {
        url: '/api/api/corporate-bodies?search=:search',
        method: 'GET',
        status: 200,
        delay: 2000,
        response: {
          data: [
            {
              portalId: 'rzMaGSQUE276KPcaaT6qwA',
              name: 'Artem Fedorenko',
              companyName: 'Artem Fedorenko',
              cin: '55513620',
              businessAddress: '01001 Žilina, Jánošíkova 8494/15A',
            },
            {
              portalId: '308XImBps8AUlxXxLNYptw',
              name: 'Dmytro Fedorenko',
              companyName: 'Dmytro Fedorenko',
              cin: '53964012',
              businessAddress: '90032 Borinka, Borinka 617',
            },
            {
              portalId: 's13iLZ_fHKQD_DhJyCKrsw',
              name: 'Dmytro Fedorenko',
              companyName: 'Dmytro Fedorenko',
              cin: '54311616',
              businessAddress: '05201 Spišská Nová Ves, Tepličská cesta 10',
            },
            {
              portalId: 'BhEtIPn8iPw50KUsUmt7-A',
              name: 'Ivan Fedorenko',
              companyName: 'Ivan Fedorenko',
              cin: '54551862',
              businessAddress: '06601 Humenné, Ševčenkova 1664/26',
            },
            {
              portalId: '-aDFln2vJBoGjavJb0Jrzg',
              name: 'Mykhailo Fedorenko',
              companyName: 'Mykhailo Fedorenko',
              cin: '53978102',
              businessAddress: '04012 Košice-Nad Jazerom, Jenisejská 45A',
            },
            {
              portalId: 'BchaeEOyCTiCZtbRpAlkJQ',
              name: 'Oksana Fedorenko',
              companyName: 'Oksana Fedorenko',
              cin: '54074321',
              businessAddress: '82107 Bratislava-Podunajské Biskupice, Hornádska 5118/20',
            },
            {
              portalId: 'jLJDLMkGFJIRPCJaelEdsA',
              name: 'Oksana Fedorenko',
              companyName: 'Oksana Fedorenko',
              cin: '53583949',
              businessAddress: '92503 Horné Saliby 783',
            },
            {
              portalId: 'biZh_P4rBB4FvSFniTTXOQ',
              name: 'Oleksandr Fedorenko',
              companyName: 'Oleksandr Fedorenko',
              cin: '54367948',
              businessAddress: '84101 Bratislava-Dúbravka, Agátová 3460/7F',
            },
            {
              portalId: 'ODA0lu7NkqW4H4JFsLIcRg',
              name: 'Oleksandr Fedorenko',
              companyName: 'Oleksandr Fedorenko',
              cin: '55007431',
              businessAddress: '82104 Bratislava-Ružinov, Doležalova 3424/15C',
            },
            {
              portalId: '5jzjypwfzwweERbkA0hhZg',
              name: 'Oleksii Fedorenko',
              companyName: 'Oleksii Fedorenko',
              cin: '53254899',
              businessAddress: '04001 Košice-Juh, Južná trieda 2881/4B',
            },
            {
              portalId: 'WW1jFa6cobBR9pULNhpDlQ',
              name: 'Roman Fedorenko',
              companyName: 'Roman Fedorenko',
              cin: '53992440',
              businessAddress: '02901 Námestovo, Slnečná 162/11',
            },
            {
              portalId: 'wHHCnyQPrXwgsYDsfR6gsw',
              name: 'Ruslan Fedorenko',
              companyName: 'Ruslan Fedorenko',
              cin: '52080536',
              businessAddress: '01841 Dubnica nad Váhom, Agátová 4301/1',
            },
            {
              portalId: 'PSY9Z4ZYx_zZjEnvPWB_0Q',
              name: 'Serhii Fedorenko',
              companyName: 'Serhii Fedorenko',
              cin: '54448549',
              businessAddress: '82108 Bratislava-Ružinov, Záhradnícka 4832/41',
            },
            {
              portalId: '3WJTShcbmeWRhgGhDzPEew',
              name: 'Serhii Fedorenko',
              companyName: 'Serhii Fedorenko',
              cin: '55539131',
              businessAddress: '84101 Bratislava-Dúbravka, Agátová 3460/7F',
            },
            {
              portalId: 'kQrU2i4l0bHUj2bikz_zcw',
              name: 'Vitalii Fedorenko',
              companyName: 'Vitalii Fedorenko',
              cin: '53849299',
              businessAddress: '95612 Preseľany 360',
            },
            {
              portalId: 'ZJEoaexuIVitZkp-Ge51gg',
              name: 'Yevheniia Fedorenko',
              companyName: 'Yevheniia Fedorenko',
              cin: '51796457',
              businessAddress: '01841 Dubnica nad Váhom, Agátová 4301/1',
            },
          ],
        },
      },
      {
        url: '/api/api/corporate-bodies/:portalId',
        method: 'GET',
        status: 200,
        delay: 2000,
        response: {
          data: {
            companyName: 'Dmytro Fedorenko',
            cin: '53964012',
            name: 'Dmytro Fedorenko',
            address: '03189 Kyjev, Viliamsa 9',
            businessAddress: '90032 Borinka, Borinka 617',
            status: 'active',
            activities: [
              {
                description: 'Reklamné a marketingové služby, prieskum trhu a verejnej mienky',
                effective_from: '2021-07-19',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Informačná činnosť',
                effective_from: '2021-07-19',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Administratívne služby',
                effective_from: '2021-07-19',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Sprostredkovateľská činnosť v oblasti obchodu, služieb, výroby',
                effective_from: '2021-07-19',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Kúpa tovaru na účely jeho predaja konečnému spotrebiteľovi (maloobchod) alebo iným prevádzkovateľom živnosti (veľkoobchod)',
                effective_from: '2021-07-19',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Počítačové služby a služby súvisiace s počítačovým spracovaním údajov',
                effective_from: '2021-07-19',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Vedenie účtovníctva',
                effective_from: '2021-07-19',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Činnosť podnikateľských, organizačných a ekonomických poradcov',
                effective_from: '2021-07-19',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Informatívne testovanie, meranie, analýzy a kontroly',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Skladovanie a pomocné činnosti v doprave',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Poskytovanie prepravných služieb nemotorovými vozidlami',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Kuriérske služby',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Nákladná cestná doprava vykonávaná vozidlami s celkovou hmotnosťou do 3,5 t vrátane prípojného vozidla',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Výroba potravinárskych výrobkov',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Výroba nápojov',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Čistiace a upratovacie služby',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Dizajnérske činnosti',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Faktoring a forfaiting',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Finančný lízing',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Fotografické služby',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Nákup, predaj alebo preprava zbraní a streliva',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Organizovanie športových, kultúrnych a iných spoločenských podujatí',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Poskytovanie sociálnych služieb',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Služby požičovní',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Záložne',
                effective_from: '2022-11-22',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Poskytovanie úverov alebo pôžičiek z peňažných zdrojov získaných výlučne bez verejnej výzvy a bez verejnej ponuky majetkových hodnôt',
                effective_from: '2022-12-28',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Finančný lízing',
                effective_from: '2022-12-28',
                effective_to: null,
                status: 'open',
              },
              {
                description: 'Prekladateľské a tlmočnícke služby:ukrajinský jazyk',
                effective_from: '2023-05-04',
                effective_to: null,
                status: 'open',
              },
            ],
            isSlovak: false,
            type: 'individual',
            register: 'Okresný úrad Malacky',
            registerNumber: '120-26011',
          },
        },
      },
    ],
  },
  render: (args) => (
    <QueryClientProvider client={new QueryClient()}>
      <I18nextProvider i18n={i18n}>
        <BusinessInfoFormCard {...args} />
      </I18nextProvider>
    </QueryClientProvider>
  ),
};
