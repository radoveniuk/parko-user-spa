import styled from 'styled-components';

export const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const FilterWrapper = styled.div`
  min-width: 200px;
`;

export const ClearFiltersWrapper = styled.div`
  min-height: 40px;
  max-height: 40px;
  min-width: 40px;
  max-width: 40px;
`;
