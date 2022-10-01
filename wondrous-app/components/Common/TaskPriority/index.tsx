import React from 'react';
import { Chip } from '@mui/material';

import { PRIORITIES } from 'utils/constants';
import styles from './styles';

type Props = {
  /**
   * The value of the priority
   */
  value: string;
};

const TaskPriority = ({ value }: Props) => {
  const priority = PRIORITIES.find((prio) => prio.value === value);

  if (!priority) {
    return null;
  }

  return (
    <Chip
      sx={{ ...styles.chip, borderColor: priority.borderColor, color: priority.textColor }}
      key={priority.label}
      icon={priority.icon}
      label={priority.label}
    />
  );
};

export default TaskPriority;
