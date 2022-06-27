import styled from 'styled-components';

export const LoginFormWrapper = styled.form`

    padding: 30px 30px 60px 30px;
    display: flex;
    flex-direction: column;
    line-height: 40px;

    span {
      color: #fff;
    }

    input {
      height: 40px;
      font-size: 20px;
      border: none;
      outline: none;
    }

    button {
      margin-top: 20px;
      background-color: #1C7C2B;
      color: #fff;
      height: 40px;
      border: none;
      transition: background-color 0.3s;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: 600;

      &:hover {
        background-color: #2ab740;
      }
  }
`;
