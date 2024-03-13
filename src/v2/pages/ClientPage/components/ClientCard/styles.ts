import styled from 'styled-components';

import { TB } from 'theme/sizeBreakpoints';

export const ProfileCardWrapper = styled.div`
  padding-top: 1px;
  max-width: 360px;
  border-radius: 5px;
  background: #FFF;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.20), 0px 2px 1px -1px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14);
  position: relative;
  height: calc(100vh - 175px);
  display: flex;
  flex-direction: column;
  color: #131313;
  overflow: auto;
  @media (max-width: ${TB}) {
    overflow: hidden;
    height: 100%;
    border: none;
    box-shadow: none;
    max-width: none;
  }

  .edit-profile-btn {
    position: absolute;
    right: 11px;
    top: 15px;
  }

  .section {
    padding: 15px;
  }

  .subtitle {
    color: #717171;
    font-size: 12px;
    font-weight: 600;
  }
  
  .contacts-info {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .name {
      font-size: 1.5rem;
      font-weight: 400;
      white-space: nowrap;
      max-width: calc(100% - 30px);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .contacts {
      display: flex;
      flex-direction: column;
      gap: 9px;
      .contact-text-link {
        color: #565656;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }

  .financial {
    border-top: 1px solid #E7E7E7;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    column-gap: 24px;
    div:last-child {
      grid-column: 1 / 3;
    }
  }

  .info-item {
    font-size: 0.85em;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 3px;

    svg {
      position: absolute;
      right: -15px;
      opacity: 0;
      transition: all.3s;
      color: #717171;
    }

    .name {
      color: #717171;
      display: inline;
    }

    .value {
      display: inline;
      position: relative;
    }

    &.copyable {
      cursor: pointer;
      &:hover {
        svg {
          opacity: 1;
        }
      }
    }
  }

  .common {
    border-top: 1px solid #E7E7E7;
  }

  .system-info {
    margin-top: auto;
    border-top: 1px solid #E7E7E7;
    border-bottom: 1px solid #E7E7E7;

    &-item {
      color: #717171;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
    }
  }

  .tabs-wrapper {
    padding: 10px;
    
    .MuiTab-root {
      width: 100%;
    }
  }
`;
