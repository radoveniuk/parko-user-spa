import styled from 'styled-components';

export const SalaryFormWrapper = styled.form`
  .inputs {
    display: flex;
    gap: 25px;
    max-width: 600px;
    justify-content: space-between;
    flex-wrap: wrap;
  
    div:last-child {
      width: 100%;
    }
  
    div:not(:last-child) {
      flex: 1;
    }
  }

  .button {
    margin-top: 15px;
  }
`;
