import styled from 'styled-components';

import { themeConfig } from 'theme';

export const AuthWrapper = styled.div`
  max-width: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;

  .auth-form {
    border: 1px solid ${themeConfig.client.secondary.main};
    border-radius: 10px;
    padding: 47px 40px 55px;
  }

  .login-header {
    flex-direction: row-reverse;
  }

  .link-reg {
    font-size: 13px;
    line-height: 20px;
    color: ${themeConfig.palette.primary.main};
    padding-right: 15px;
  }

  @media screen and (max-width: 480px){
    height: 75%;

    .auth-form {
      border: 0;
      padding: 45px 30px 30px;
    }

    .stack-auth-layouts {
      padding: 0 40px 45px;
      margin-top: 0;
    }

    .link-reg {
      padding-right: 0;
    }

    .lang-selector {
      > button {
        padding-left: 0;
      }
    }
  }
`;
