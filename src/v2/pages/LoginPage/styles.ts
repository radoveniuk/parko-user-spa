import styled from 'styled-components';

export const LoginFormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    line-height: 40px;
    margin-top: 30px;
    gap: 20px;

    .MuiFormControl-root:first-child {
      margin-bottom: 20px;
    }

    button:not(.MuiIconButton-root) {
      width: 90px;
    }
`;
