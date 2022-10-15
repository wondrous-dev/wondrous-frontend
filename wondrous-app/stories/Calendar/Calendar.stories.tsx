import React from 'react';
import { ComponentMeta } from '@storybook/react';
import Box from '@mui/material/Box';

import WonderCalendar from 'components/Calendar';

export default {
  title: 'Task Board/Calendar',
  component: WonderCalendar,
} as ComponentMeta<typeof Calendar>;

const Template = () => (
  <Box>
    <WonderCalendar />
  </Box>
);
export const Calendar = Template.bind({});
