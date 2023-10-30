import styled from 'styled-components';

export const ProfileCardWrapper = styled.div`
  max-width: 360px;
  border-radius: 5px;
  border-top: 1px solid #D0D0D0;
  background: #FFF;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.20), 0px 2px 1px -1px rgba(0, 0, 0, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.14);
  position: relative;
  /* height: calc(100vh - 100px); */
  display: flex;
  flex-direction: column;
  color: #131313;
  /* overflow: auto; */

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

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-width: 290px;
    padding: 15px 15px 0 15px;
  }
  
  .contacts-info {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .name-and-sex {
      display: flex;
      align-items: center;
      gap: 10px;
      .name {
        font-size: 24px;
        font-weight: 400;
      }
    }

    .contacts {
      display: flex;
      flex-direction: column;
      gap: 9px;
      .contact-text-link {
        color: #131313;
        font-size: 16px;
      }
    }
  }

  .common {
    border-top: 1px solid #E7E7E7;
    border-bottom: 1px solid #E7E7E7;

    &-item {
      color: #717171;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
    }
  }

  .work-history {
    display: flex;
    flex-direction: column;
    gap: 12px;

    &-list {
      display: flex;
      flex-direction: column;
      gap: 5px;

      &-item {
        color: #717171;
        font-size: 14px;
        font-weight: 600;
        line-height: 18px;
        &:first-child {
          color: #131313;
        }
      }
    }
  }

  .system-info {
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

export const AddTagMenuButton = styled.button`
  outline: none;
  border: none;
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
  &:hover {
    background: #d3d3d3;
  }
  &:disabled {
    background: #F3F3F3;
    cursor: default;
    pointer-events: none;
  }
`;
