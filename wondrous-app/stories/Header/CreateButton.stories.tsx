import React from 'react';

import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button } from 'components/Button';
import { HeaderCreateButton } from 'components/Header/styles';
import { CreateIconOutlined } from 'components/Icons/createBtn';

export default {
  title: 'Header/Buttons',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `Button with create icon`,
      },
    },
  },
  argTypes: {
    visibility: {
      control: {
        type: 'boolean',
      },
    },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <HeaderCreateButton {...args}>
    <CreateIconOutlined id="tour-header-create-btn" />
  </HeaderCreateButton>
);
export const CreateEntityButton = Template.bind({});

CreateEntityButton.args = {
  visibility: true,
};
