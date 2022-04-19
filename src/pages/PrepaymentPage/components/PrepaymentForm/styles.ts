import styled from 'styled-components';

export const StyledForm = styled.form`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 24px 70px;

  .input-wrapper, .textarea-wrapper {
    margin-bottom: 30px;
    flex: 40%;
    margin: 10px;
  }

  .button-wrapper {
    margin: 0 auto;
  }
`;
