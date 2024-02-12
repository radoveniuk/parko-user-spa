import styled from 'styled-components';

import { themeConfig } from 'theme';

const StatusLabel = styled.div`
  &.candidate, &.development, &.pending {
    background-color: #f0c844;
    color: #2b2b2b;
  }
  &.hired, &.active, &.paid, &.approved, &.continues {
    background-color: ${themeConfig.palette.success.main};
  }
  &.approved, &.future {
    background-color: ${themeConfig.palette.success.light};
    color: #2b2b2b;
  }
  &.canceled, &.inactive, &.finished {
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
  white-space: nowrap;
  max-height: min-content;
`;

export default StatusLabel;
