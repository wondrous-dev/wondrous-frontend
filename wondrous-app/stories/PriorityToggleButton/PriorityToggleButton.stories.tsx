import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Box } from '@mui/material';

import TaskPriorityToggleButton from 'components/Common/TaskPriority/TaskPriorityToggleButton';
import { Formik } from 'formik';

export default {
  title: 'Inputs/PriorityToggleButton',
  component: TaskPriorityToggleButton,
} as ComponentMeta<typeof TaskPriorityToggleButton>;

const Template: ComponentStory<typeof TaskPriorityToggleButton> = (args) => (
  <Box
    sx={{
      width: '400px',
    }}
  >
    <Formik
      initialValues={{
        priority: '',
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ setFieldValue, values }) => (
        <TaskPriorityToggleButton {...args} value={values.priority} setValue={setFieldValue} />
      )}
    </Formik>
  </Box>
);
export const Toggle = Template.bind({});
