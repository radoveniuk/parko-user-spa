import styled from 'styled-components';

import { themeConfig } from 'theme';

const StatusLabel = styled.div`
  &.candidate, &.development {
    background-color: #f0c844;
    color: #2b2b2b;
  }
  &.hired, &.active {
    background-color: ${themeConfig.palette.success.main};
  }
  &.canceled, &.inactive {
    background-color: #717171;
  }
  &.fired, &.rejected {
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
