import styled from 'styled-components';

import { themeConfig } from 'theme';

const StatusLabel = styled.div`
  &.candidate {
    background-color: #f0c844;
    color: #2b2b2b;
  }
  &.hired {
    background-color: ${themeConfig.palette.success.main};
  }
  &.canceled {
    background-color: #717171;
  }
  &.fired {
    background-color: #E72A2A;
  }
  &.undefined {
    display: none;
  }
  color: #fff;
  font-size: 0.7rem;
  padding: 1px 4px;
  border-radius: 2px;
  max-width: min-content;
`;

export default StatusLabel;
