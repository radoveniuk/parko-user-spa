import styled from 'styled-components';
import backgroundImage from 'components/assets/images/login-background.webp';

export const LoginPageWrapper = styled.div`
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;

  .lang-selector {
    position: absolute;
    top: 30px;
    right: 30px;
  }
`;
