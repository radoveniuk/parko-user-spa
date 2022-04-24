import styled from 'styled-components';

export const LoginFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 5vh auto;
  background-color: rgba(0, 0, 0, 0.41);

  .header {
    display: flex;
    padding: 20px 30px;
    border-bottom: 1px solid #fff;
    
    span {
      color: #fff;
      margin-right: 20px;
      
      &.active {
        text-decoration: underline;
      }
    }

  }

  .fields {
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

      &:hover {
        background-color: #2ab740;
      }
    }
  }
`;
