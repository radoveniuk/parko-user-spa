import styled from 'styled-components';

export const RegisterFormWrapper = styled.div`
  padding: 30px 30px 60px 30px;
  display: flex;
  flex-direction: column;
  line-height: 40px;

  span {
    color: #fff;

    &.error {
      color: #f06161;
      
      &::after {
        content: '*';
      }
    }
  }

  input {
    height: 40px;
    font-size: 20px;
    border: none;
    outline: none;
  }

  .MuiTextField-root {
    background-color: #fff;
    
    .MuiOutlinedInput-root {
      max-height: 42px;
    }

    fieldset {
      border: none;
    }
  }

  button[type=submit] {
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
    
    &:disabled {
      background-color: #6a6a6a;
      pointer-events: none;
    }
  }

  .PhoneInputCountryIcon, .PhoneInputCountrySelectArrow {
    color: #fff !important;
  }
`;
