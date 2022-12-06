import styled from 'styled-components';

export const ProjectFormWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  max-height: 600px;
  min-height: 600px;
  overflow: auto;
  
  .accordion {
    .MuiTextField-root, .PhoneInput {
      max-width: 213px;
    }

    .inputs-select {
      width: 213px;
    }
  }
`;
