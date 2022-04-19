import styled from 'styled-components';
import { colors } from 'theme/colors';

export const TextAreaWrapper = styled.div`
  position: relative;
  max-width: 70%;

  .material-textarea-label {
    position: absolute;
    font-size: 1rem;
    left: 0;
    top: 25px;
    transform: translateY(-50%);
    background-color: white;
    color: ${colors.default};
    padding: 0 0.3rem;
    margin: 0 0.5rem;
    transition: .1s ease-out;
    transform-origin: left top;
    pointer-events: none;
  }
  .material-textarea {
    font-size: 1rem;
    outline: none;
    border: 1px solid ${colors.default};
    border-radius: 2px;  
    padding: 1rem 0.7rem;
    color: ${colors.default};
    transition: 0.1s ease-out;
  }
  .material-textarea:focus {
    border-color: ${colors.primary};  
  }
  .material-textarea:focus + .material-textarea-label {
    color: ${colors.primary};
    top: 0;
    transform: translateY(-50%) scale(.9);
  }
  .material-textarea:not(:placeholder-shown) + .material-textarea-label {
    top: 0;
    transform: translateY(-50%) scale(.9);
  }
`;
