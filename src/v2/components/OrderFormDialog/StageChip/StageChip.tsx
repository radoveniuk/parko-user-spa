import React, { memo, useState } from 'react';
import { Popover } from '@mui/material';

import { ORDER_STAGE_COLORS } from 'constants/colors';
import { IOrderStage } from 'interfaces/order.interface';

import { ColorPickBtn, ColorPickerWrapper, StageChipWrapper } from './styles';

type Props = {
  data: IOrderStage;
  onChange(data: IOrderStage): void;
  onDelete(): void;
};

const StageChip = ({ data, onChange, onDelete }: Props) => {
  const [colorsPopoverAnchorEl, setColorsPopoverAnchorEl] = useState<HTMLDivElement | null>(null);

  const openColors = Boolean(colorsPopoverAnchorEl);
  const popoverId = openColors ? 'colors-popover' : undefined;
  return (
    <StageChipWrapper className={data.staticName ? 'disabled' : ''}>
      {data.name}
      <ColorPickBtn
        style={{ backgroundColor: ORDER_STAGE_COLORS[data.color]?.[0] }}
        onClick={(e) => {
          if (!data.staticName) {
            setColorsPopoverAnchorEl(e.currentTarget);
          }
        }}
      />
      <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" className="CancelIcon" onClick={!data.staticName ? onDelete : undefined}>
        {/* eslint-disable-next-line max-len */}
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
      </svg>
      <Popover
        id={popoverId}
        open={openColors}
        anchorEl={colorsPopoverAnchorEl}
        onClose={() => {
          setColorsPopoverAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <ColorPickerWrapper>
          {Object.keys(ORDER_STAGE_COLORS).map((colorName) => {
            const backgroundColor = ORDER_STAGE_COLORS[colorName][0];
            return (
              <ColorPickBtn
                key={colorName}
                style={{ backgroundColor }}
                onClick={() => {
                  onChange({
                    ...data,
                    color: colorName,
                  });
                  setColorsPopoverAnchorEl(null);
                }}
              />
            );
          })}
        </ColorPickerWrapper>
      </Popover>
    </StageChipWrapper>
  );
};

export default memo(StageChip);
