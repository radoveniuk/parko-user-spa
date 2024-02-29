import styled from 'styled-components';

export const MobileCardWrapper = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;

  .name {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8em;
    margin-top: 5px;
  }

  .date {
    font-size: 0.7em;
    color: #b9b9b9;
  }
`;
