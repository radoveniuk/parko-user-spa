import styled from 'styled-components';
import { FormCardBodyRow } from 'v2/uikit/FormCard';

export const CountrySelectOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StyledFormCardBodyRow = styled(FormCardBodyRow)`
  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;
