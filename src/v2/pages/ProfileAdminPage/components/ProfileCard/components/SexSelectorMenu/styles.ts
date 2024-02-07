import styled from 'styled-components';

export const SexSelectorMenuWrapper = styled.div`
  width: 36px;
  height: 36px;
  background: #E7E7E7;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  transition: .3s;
  
  span:last-child {
    display: none;
  }
  
  &:hover, .active {
    background: #d3d3d3;
    width: 100px;
    span:last-child {
      display: initial;
    }
  }
`;
