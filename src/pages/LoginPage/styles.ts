import styled from 'styled-components';

import backgroundImage from 'components/assets/images/login-background.webp';

export const LoginPageWrapper = styled.div`
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;

  .login-header {
    flex-direction: row-reverse;
  }

  .lang-selector {
    position: absolute;
    top: 30px;
    right: 30px;
  }

  @media only screen and (max-width: 530px) {
    .lang-selector {
      margin-right: 10px;
      margin-left: 10px;
      position: inherit;
    }
  }
`;
