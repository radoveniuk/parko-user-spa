import styled from 'styled-components';
import { colors } from 'theme/colors';

export const InputWrapper = styled.div`
  position: relative;
  max-height: 50px;
  display: flex;
  flex-direction: column;
  max-width: 200px;

  .error-text {
    color: red;
    font-size: 12px;
  }

  label {
    position: absolute;
    font-size: 1rem;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: white;
    color: ${colors.default};
    padding: 0 0.3rem;
    margin: 0 0.5rem;
    transition: .1s ease-out;
    transform-origin: left top;
    pointer-events: none;
  }
  input {
    font-size: 1rem;
    outline: none;
    border: 1px solid ${colors.default};
    border-radius: 2px;  
    padding: 1rem 0.7rem;
    color: ${colors.default};
    transition: 0.1s ease-out;
  }
  input:focus {
    border-color: ${colors.primary};  
  }
  input:focus + label {
    color: ${colors.primary};
    top: 0;
    transform: translateY(-50%) scale(.9);
  }
  input:not(:placeholder-shown) + label {
    top: 0;
    transform: translateY(-50%) scale(.9);
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
  input[type="number"] {
      -moz-appearance: textfield;
  }
`;
