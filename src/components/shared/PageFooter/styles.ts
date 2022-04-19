import styled from 'styled-components';
import { colors } from 'theme/colors';
import { SM } from 'theme/sizeBreakpoints';

export const FooterWrapper = styled.footer`
  display: flex;
  background-color: ${colors.secondaryLight};
  margin-top: auto;
  padding: 30px 75px;
  position: relative;

  h3, p, ul {
    margin: 0;
    padding: 0;
  }
  
  .contactsInfo {
    color: ${colors.default};
    width: 70%;

    .title {
      font-weight: 400;
      font-size: 30px;
      margin-bottom: 20px;
    }

    .infoText {
      font-weight: 400;
      font-size: 18px;
    }
  }

  .contactsList {
    list-style-type: none;
    li {
      margin-bottom: 15px;
      font-size: 18px;
      a {
        color: ${colors.secondary};
        transition: color 0.3s;
        &:hover {
          color: ${colors.secondaryDark};
        }
      }
    }
  }

  @media (max-width: ${SM}) {
    flex-direction: column;

    .contactsList {
      margin-top: 30px;
    }
  }
`;
