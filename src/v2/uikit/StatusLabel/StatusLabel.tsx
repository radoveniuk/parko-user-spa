import styled, { css } from 'styled-components';

import { themeConfig } from 'theme';

export const STATUS_LABEL_COLOR_STYLES = css`
  &.candidate, &.development, &.pending {
    background-color: #f0c844;
    color: #2b2b2b;
    &:hover {
      background-color: #f0c844 !important;
    }
  }
  &.hired, &.active, &.paid, &.approved, &.continues {
    background-color: ${themeConfig.palette.success.main};
    color: #fff;
    &:hover {
      background-color: ${themeConfig.palette.success.main} !important;
    }
  }
  &.approved, &.future {
    background-color: ${themeConfig.palette.success.light};
    color: #2b2b2b;
    &:hover {
      background-color: ${themeConfig.palette.success.light} !important;
    }
  }
  &.canceled, &.inactive, &.finished {
    background-color: #717171;
    color: #fff;
    &:hover {
      background-color: #717171 !important;
    }
  }
  &.fired, &.rejected {
    background-color: #E72A2A;
    color: #fff;
    &:hover {
      background-color: #E72A2A !important;
    }
  }
  &.potential {
    background-color: #FFEB3B;
    color: #2b2b2b;
    &:hover {
      background-color: #FFEB3B !important;
    }
  }
  &.contacted {
    background-color: #64B5F6;
    color: #2b2b2b;
    &:hover {
      background-color: #64B5F6 !important;
    }
  }
  &.negotiation {
    background-color: #90A4AE;
    color: #2b2b2b;
    &:hover {
      background-color: #90A4AE !important;
    }
  }
  &.undefined {
    display: none;
  }
`;

const StatusLabel = styled.div`
  ${STATUS_LABEL_COLOR_STYLES}
  font-size: 0.7rem;
  padding: 1px 4px;
  border-radius: 2px;
  max-width: min-content;
  width: min-content;
  white-space: nowrap;
  max-height: min-content;
`;

export default StatusLabel;
