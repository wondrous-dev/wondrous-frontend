import React from 'react';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import palette from 'theme/palette';
import { PRIORITIES } from 'utils/constants';
import styles from './styles';

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
    <Grid sx={styles.grid}>
      <ToggleButtonGroup value={value} exclusive onChange={handleChange} sx={styles.toggleButtonGroup}>
        {PRIORITIES.map((priority) => (
          <ToggleButton
            key={priority.value}
            value={priority.value}
            sx={{
              ...styles.toggleButton,
              '&&.Mui-selected, &&:hover': {
                backgroundColor: palette.grey99,
                color: priority.textColor,
                border: `1px solid ${priority.borderColor}`,
                borderRadius: '4px',
              },
            }}
          >
            {priority.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Grid>
  );
};

export default TaskPriorityToggleButton;
