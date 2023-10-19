import styled from 'styled-components';

export const Button = styled.button.attrs({ className: 'AddFilterButton' })`
  display: flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1px dashed #A1A1A1;
  border-radius: 32px;
  cursor: pointer;
  color: #717171;
  font-weight: 400;
  height: 41px;
  width: 180px;
  justify-content: center;
  transition: .3s;
  font-size: 14px;

  &:hover {
    background-color: #7171710f;
  }
  &:active {
    background-color: transparent;
  }
`;
