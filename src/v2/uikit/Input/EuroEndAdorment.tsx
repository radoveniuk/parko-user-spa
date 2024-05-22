import React from 'react';
import styled from 'styled-components';

import { EuroIcon } from 'components/icons';

const EuroEndAdormentWrapper = styled.div`
  display: flex;
  margin-right: 10px;
  color: #00000089;
`;

export const EuroEndAdornment = (
  <EuroEndAdormentWrapper>
    <EuroIcon />
  </EuroEndAdormentWrapper>
);
