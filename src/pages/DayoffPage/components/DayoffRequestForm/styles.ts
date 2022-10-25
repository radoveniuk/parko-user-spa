import styled from 'styled-components';

import { SM } from 'theme/sizeBreakpoints';

export const StyledForm = styled.form`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  flex-direction: column;
  margin: 24px auto;

  .fields-row {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    div {
      margin: 0px 10px 10px 0px;
    }
  }

  .fields-grid {
    display: grid;
    margin: 10px auto;
    gap: 20px;
    grid-template-columns: 1fr 1fr;

    @media (max-width: ${SM}) {
      grid-template-columns: 1fr;
    }
  }

  .button-wrapper {
    margin: 0 auto;
  }
`;
