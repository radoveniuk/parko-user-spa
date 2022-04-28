import styled from 'styled-components';

export const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-top: 5vh;
  margin-left: auto;
  margin-right: auto;
  background-color: rgba(0, 0, 0, 0.41);

  .header {
    display: flex;
    padding: 20px 30px;
    border-bottom: 1px solid #fff;
    
    span {
      color: #fff;
      margin-right: 20px;
      cursor: pointer;
      
      &.active {
        text-decoration: underline;
      }
    }

  }
`;
