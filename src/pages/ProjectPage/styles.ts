import styled from 'styled-components';

export const ProjectFormWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  
  .inputs {
    justify-content: center;
    max-width: 500px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 0 auto;

    .MuiTextField-root, .PhoneInput {
      max-width: 213px;
    }

    .inputs-select {
      width: 213px;
    }
  }

  .submit-button {
    margin: 15px auto;
  }
`;
