import React from 'react';
import { ComponentMeta } from '@storybook/react';
import Box from '@mui/material/Box';

import TaskPriorityChip from 'components/Common/TaskPriority';
import { PRIORITIES } from 'utils/constants';

export default {
  title: 'Task/TaskPriority',
  component: TaskPriorityChip,
} as ComponentMeta<typeof TaskPriorityChip>;

const Template = () =>
  PRIORITIES.map((priority) => (
    <Box my="10px">
      <TaskPriorityChip key={priority.value} value={priority.value} />
    </Box>
  ));

export const TaskPriority = Template.bind({});
