import styled from 'styled-components';

export const StyledForm = styled.form`
  text-align: center;

  .fields-list {

    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 24px 10%;
  
    .input-wrapper {
      margin-bottom: 30px;
      margin: 10px;
      min-width: 300px;
    }
  }

  .button-wrapper {
    margin: 0 auto;
  }
`;
