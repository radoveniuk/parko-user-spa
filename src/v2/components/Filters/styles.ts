import styled from 'styled-components';
import { Button } from 'v2/uikit';

import { SM } from 'theme/sizeBreakpoints';

export const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const FilterWrapper = styled.div`
  min-width: 200px;

  .switch {
    height: 36px;
    &.checked {
      background-color: rgba(42, 106, 231, 0.2);
    }
  }
`;

export const ClearFiltersWrapper = styled.div.attrs({ className: 'clear-filter' })`
  min-height: 40px;
  max-height: 40px;
  min-width: 40px;
  max-width: 40px;
`;

export const FilterButton = styled.button`
  height: 36px;
  border-radius: 32px;
  padding: 0 12px;
  cursor: pointer;
  transition: .3s;
  white-space: nowrap;
  background: #c6dbe1;
  color: #215A6C;
  border: 1px dashed transparent;

  &.active {
    border-color: #215A6C;
  }

  &:not(:hover):not(:active):not(.active) {
    filter: grayscale(1) opacity(0.5);
    border-color: transparent;
  }

  &:hover {
    filter: brightness(95%);
  }
`;

export const StyledHeaderFilterButton = styled(Button)`
  background-color: rgba(42, 106, 231, 0.04) !important;
  
  &:hover {
    background-color: rgba(42, 106, 231, 0.08) !important;
  }
  
  &.active {
    background-color: rgba(42, 106, 231, 0.2) !important;
  }

  @media (max-width: ${SM}) {
    display: none !important;
  }
`;
