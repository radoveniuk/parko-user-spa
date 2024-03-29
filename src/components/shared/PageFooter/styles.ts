import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const FooterWrapper = styled.footer`
  background-color: ${themeConfig.palette.secondary.light};
  margin-top: auto;
  padding: 30px 75px;
  position: relative;

  h3, p, ul {
    margin: 0;
    padding: 0;
  }

  .title {
    font-weight: 400;
    font-size: 30px;
    margin-bottom: 20px;
  }

  .content {
    display: flex;
    
    .contactsInfo {
      color: #30384F;
      width: 100%;
      padding-right: 15px;
  
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
          color: ${themeConfig.palette.secondary.main};
          transition: color 0.3s;
          &:hover {
            color: ${themeConfig.palette.secondary.dark};
          }
        }
      }
    }
  
  }
  @media (max-width: ${SM}) {
    padding: 30px;
    
    .content {
      flex-direction: column;
    }

    .contactsList {
      margin-top: 30px;
    }
  }
`;
