import React from 'react';

import { PRIORITIES } from 'utils/constants';
import { PriorityChipStyled } from './styles';

type Props = {
  /**
   * The value of the priority
   */
  value: string;
};

const TaskPriorityChip = ({ value }: Props) => {
  const priority = PRIORITIES.find((prio) => prio.value === value);

  if (!priority) {
    return null;
  }

  return (
    <div>
      <PriorityChipStyled
        key={priority.label}
        icon={priority.icon}
        label={priority.label}
        textColor={priority.textColor}
        borderColor={priority.borderColor}
      />
    </div>
  );
};

export default TaskPriorityChip;
