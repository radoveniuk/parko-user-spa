import styled from 'styled-components';

export const CorporateBodiesSearchField = styled.div`
  position: relative;
`;

export const CorporateBodiesDropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 1;
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  max-height: 200px;
  overflow: auto;

  li {
    padding: 6px 12px;
    cursor: pointer;
    transition: .3s;

    &:hover {
      background-color: #fafafa;
    }

    .title {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      font-size: 12px;
      margin-bottom: 6px;
    }
    .address {
      font-size: 11px;
      color: #717171;
    }
  }
`;

export const InputLoaderWrapper = styled.div`
  display: flex;
  margin-right: 6px;
`;

export const LoaderWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(255 255 255 / 50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
`;
