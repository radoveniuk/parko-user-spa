import styled from 'styled-components';

export const StageChipWrapper = styled.div`
  text-transform: uppercase;
  height: 36px;
  border-radius: 5px;
  background: rgb(231, 231, 231);
  -webkit-tap-highlight-color: transparent;
  -webkit-text-decoration: none;
  max-width: 100%;
  font-family: Roboto;
  font-size: 0.8125rem;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.87);
  white-space: nowrap;
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  cursor: unset;
  outline: 0;
  -webkit-text-decoration: none;
  text-decoration: none;
  border: 0;
  padding: 0;
  vertical-align: middle;
  box-sizing: border-box;
  gap: 12px;
  padding-left: 12px;

  .color {
    width: 1.4em;
    height: 1.4em;
    border-radius: 50%;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.26);
  }

  .CancelIcon {
    -webkit-tap-highlight-color: transparent;
    color: rgba(0, 0, 0, 0.26);
    font-size: 22px;
    cursor: pointer;
    margin: 0 5px 0 -6px;
    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    flex-shrink: 0;
    user-select: none;
    width: 1em;
    height: 1em;
    display: inline-block;
    fill: currentColor;

    &:hover {
      color: rgba(0, 0, 0, 0.4);
    }
  }
`;
