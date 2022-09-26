import styled from 'styled-components';

export const ProjectFormWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  
  .accordion {
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
