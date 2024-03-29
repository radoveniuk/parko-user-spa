import styled from 'styled-components';

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
