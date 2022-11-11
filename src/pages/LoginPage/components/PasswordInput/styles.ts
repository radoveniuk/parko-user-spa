import styled from 'styled-components';

export const PasswordInputWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  background-color: #fff;

  input[type=password], input[type=text] {
    flex-grow: 1;
  }
`;
