import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Box from '@mui/material/Box';

import TaskPriorityToggleButton from 'components/Common/TaskPriorityToggleButton';
import { PRIORITIES } from 'utils/constants';

export default {
  title: 'Task/PriorityToggleButton',
  component: TaskPriorityToggleButton,
} as ComponentMeta<typeof TaskPriorityToggleButton>;

const Template: ComponentStory<typeof TaskPriorityToggleButton> = (args) => {
  const [priority, setPriority] = useState(PRIORITIES[0].value);

  return (
    <Box
      sx={{
        width: '400px',
      }}
    >
      <TaskPriorityToggleButton {...args} value={priority} setValue={(key, value) => setPriority(value)} />
    </Box>
  );
};
export const PriorityToggleButton = Template.bind({});
