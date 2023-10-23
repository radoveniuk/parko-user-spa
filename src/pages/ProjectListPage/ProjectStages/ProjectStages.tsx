import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';

import { CloseIcon, PlusIcon } from 'components/icons';
import IconButton from 'v2/uikit/IconButton';
import Input from 'components/shared/Input';

import { ProjectStagesSettingsWrapper, ProjectStagesWrapper, StageItem } from './styles';

const reorder = (list: string[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type Props = {
  defaultValue?: string[];
  onChange(values: string[]): void
};

const ProjectStages = ({ defaultValue, onChange }: Props) => {
  const [stages, setStages] = useState(defaultValue || []);
  const { t } = useTranslation();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      stages,
      result.source.index,
      result.destination.index,
    );
    setStages(items);
  };

  const removeStage = (itemToDelete: string) => {
    setStages((prev) => prev.filter((item) => item !== itemToDelete));
  };

  const [stageText, setStageText] = useState('');

  const addStage = () => {
    if (!stageText) return;
    setStages((prev) => {
      const dictionarySet = new Set(prev || []);
      dictionarySet.add(stageText);
      return [...Array.from(dictionarySet)];
    });
    setStageText('');
  };

  useEffect(() => {
    onChange(stages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stages]);

  return (
    <ProjectStagesSettingsWrapper>
      <Input
        label={t('add')}
        value={stageText}
        onChange={(e) => void setStageText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            addStage();
          }
        }}
        InputProps={{
          endAdornment: (
            <IconButton onClick={addStage}><PlusIcon /></IconButton>
          ),
        }}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ProjectStagesWrapper
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {stages.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided, snapshot) => (
                    <StageItem
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      isDragging={snapshot.isDragging}
                    >
                      <p>{item}</p>
                      <IconButton onClick={() => void removeStage(item)}><CloseIcon /></IconButton>
                    </StageItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ProjectStagesWrapper>
          )}
        </Droppable>
      </DragDropContext>
    </ProjectStagesSettingsWrapper>
  );
};

export default ProjectStages;
