import React from 'react';

import { ButtonGroup } from './ButtonGroup';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Wondrous/ButtonGroup',
  component: ButtonGroup,
  argTypes: {
    onClick: {
      description: 'Optional. onClick function\n' + '`(() => void) | undefined`',
    },
    key: {
      description: 'help identify which items have been changed, added, or removed',
      options: ['key'],
      control: { type: 'select' },
      defaultValue: 'key',
    },
    variant: {
      description:
        'a prop for React-Bootstrap components which wrap the various predefined styles for the different bootstrap components',
        options: ['contained', 'outlined'],
        control: { type: 'select' },
        defaultValue: 'contained',
    },
  },
} as ComponentMeta<typeof ButtonGroup>;

const Template: ComponentStory<typeof ButtonGroup> = (args) => <ButtonGroup {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'ButtonGroup',
};
