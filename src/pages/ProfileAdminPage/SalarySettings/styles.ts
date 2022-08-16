import styled from 'styled-components';

export const SalaryFormWrapper = styled.form`
  padding: 15px;

  .inputs {
    display: flex;
    gap: 20px;
    max-width: 500px;
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
