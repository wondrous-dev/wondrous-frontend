import React from 'react';
import { Grid, ToggleButtonGroup } from '@mui/material';

import palette from 'theme/palette';
import { PRIORITIES } from 'utils/constants';
import { GridStyle, ToggleButtonGroupStyle, ToggleButtonStyle } from './styles';

type Props = {
  /**
   * The value of the priority
   */
  value: string;
  /**
   * The function to set the value of the priority
   */
  setValue: (priority: string, newPriority: string) => void;
};

const TaskPriorityToggleButton = ({ value, setValue }: Props) => {
  const handleChange = (event: React.MouseEvent<HTMLElement>, newPriority: string) => {
    setValue('priority', newPriority);
  };

  return (
    <Grid sx={GridStyle}>
      <ToggleButtonGroup value={value} exclusive onChange={handleChange} sx={ToggleButtonGroupStyle}>
        {PRIORITIES.map((button) => (
          <ToggleButtonStyle
            key={button.value}
            value={button.value}
            borderColor={button.borderColor}
            textColor={button.textColor}
          >
            {button.label}
          </ToggleButtonStyle>
        ))}
      </ToggleButtonGroup>
    </Grid>
  );
};

export default TaskPriorityToggleButton;
