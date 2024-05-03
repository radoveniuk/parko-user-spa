import styled from 'styled-components';
import { Button } from 'v2/uikit';

export const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 12px;
  height: 100%;

  .apply-filter-btn {
    margin-top: auto;
  }
`;

export const InternalFilterButton = styled(Button)`
  background-color: rgba(42, 106, 231, 0.04) !important;
  
  &:hover {
    background-color: rgba(42, 106, 231, 0.08) !important;
  }
  
  &.active {
    background-color: rgba(42, 106, 231, 0.2) !important;
  }
`;
