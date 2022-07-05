import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button, GreyButton } from 'components/Button';

export default {
  title: 'Wondrous/Buttons',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Buttons allow users to take actions, and make choices, with a single tap.
ads via Carbon

[Documentation](https://mui.com/material-ui/react-button/)

[API](https://mui.com/material-ui/api/button/)
`,
      },
    },
  },
  argTypes: {
    disabled: {
      description: 'If `true`, the component is disabled.',
      control: {
        type: 'boolean',
      },
    },
  },
} as ComponentMeta<typeof Button>;

const PrimaryTemplate: ComponentStory<typeof Button> = (args) => <Button {...args}>Primary</Button>;
export const Primary = PrimaryTemplate.bind({});

const GreyButtonTemplate: ComponentStory<typeof Button> = (args) => <GreyButton {...args}>Grey</GreyButton>;
export const Grey = GreyButtonTemplate.bind({});
