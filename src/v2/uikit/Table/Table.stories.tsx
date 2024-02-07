import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';

import { EditIcon } from 'components/icons';

import IconButton from '../IconButton';

import { Table, TableBody, TableCell, TableHead, TableRow } from './Table';

const meta: Meta<typeof Table> = {
  component: Table,
  argTypes: {
  },
};

export default meta;

type Story = StoryObj<typeof Table>;

const Nobr = styled.div`
  white-space: nowrap;
`;

export const Simple: Story = {
  render: () => (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Inžinierske činnosti, technické testovanie a analýzy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Poskytovanie služieb rýchleho občerstvenia v spojení s predajom na priamu konzumáciu, prevádzkovanie výdajne stravy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Inžinierske činnosti, technické testovanie a analýzy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Poskytovanie služieb rýchleho občerstvenia v spojení s predajom na priamu konzumáciu, prevádzkovanie výdajne stravy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Inžinierske činnosti, technické testovanie a analýzy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Poskytovanie služieb rýchleho občerstvenia v spojení s predajom na priamu konzumáciu, prevádzkovanie výdajne stravy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Inžinierske činnosti, technické testovanie a analýzy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Poskytovanie služieb rýchleho občerstvenia v spojení s predajom na priamu konzumáciu, prevádzkovanie výdajne stravy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Inžinierske činnosti, technické testovanie a analýzy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Poskytovanie služieb rýchleho občerstvenia v spojení s predajom na priamu konzumáciu, prevádzkovanie výdajne stravy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Inžinierske činnosti, technické testovanie a analýzy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Poskytovanie služieb rýchleho občerstvenia v spojení s predajom na priamu konzumáciu, prevádzkovanie výdajne stravy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Inžinierske činnosti, technické testovanie a analýzy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Poskytovanie služieb rýchleho občerstvenia v spojení s predajom na priamu konzumáciu, prevádzkovanie výdajne stravy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithControls: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Controls</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Inžinierske činnosti, technické testovanie a analýzy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
          <TableCell align="right"><IconButton><EditIcon/></IconButton></TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Poskytovanie služieb rýchleho občerstvenia v spojení s predajom na priamu konzumáciu, prevádzkovanie výdajne stravy</TableCell>
          <TableCell><Nobr>14.10.2023 - 15.02.2024</Nobr></TableCell>
          <TableCell align="right"><IconButton><EditIcon/></IconButton></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
