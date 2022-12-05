import styled from 'styled-components';

export const ProjectStagesSettingsWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

export const ProjectStagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StageItem = styled.div<{ isDragging: boolean }>`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.isDragging ? 'rgb(211 211 211)' : 'rgb(246, 246, 246)'};
  padding: 0 8px;
  gap: 10px;
  border-radius: 10px;
  min-width: 200px;
  
  p {
    flex-grow: 1;
  }
`;
