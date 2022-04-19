import styled from 'styled-components';
import { SM } from 'theme/sizeBreakpoints';

export const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 300px 300px;
  margin: 24px 70px;
  
  @media (max-width: ${SM}) {
    grid-template-columns: 1fr;

    .input-wrapper, .textarea-wrapper {
      margin-bottom: 30px;
    }
  }
`;
