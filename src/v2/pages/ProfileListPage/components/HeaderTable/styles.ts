import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  background: #F5F5F5;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px 0 35px;

  .link {
    color: #e72a33;
    display: flex;
    align-items: center;
  }

  .bold {
    font-weight: bold;
  }

  .divider {
    height: 15px;
    background: #aaa;
  }

  .menu-arrow {
    margin-left: 5px;
  }
`;
