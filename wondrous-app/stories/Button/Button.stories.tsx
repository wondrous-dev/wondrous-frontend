import React from 'react';

import { Button } from './Button';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Wondrous/Button',
  component: Button,
  argTypes: {
    onClick: {
      description: 'Optional. onClick function\n' +
          '`(() => void) | undefined`',
    },
    className: {
      description: 'used to set or return the value of an element\'s class attribute',
    }
  }
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Button',
};
