import styled from 'styled-components';

export const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const FilterWrapper = styled.div`
  min-width: 200px;
`;

export const ClearFiltersWrapper = styled.div.attrs({ className: 'clear-filter' })`
  min-height: 40px;
  max-height: 40px;
  min-width: 40px;
  max-width: 40px;
`;
