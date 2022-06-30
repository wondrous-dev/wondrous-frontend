import React from 'react';

import { Table } from './Table';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Wondrous/Table',
  component: Table,
  argTypes: {
    align: {
      control: { type: 'select' },
      description: 'specifies the horizontal alignment of text in an element',
      options: ['center', 'left', 'right'],
      defaultValue: 'center',
    },
    width: {
      control: { type: 'select' },
      description: 'Sets the width of an element’s content',
      options: ['56px', '105px', '77px', '88px', '80px', '54px', '383px'],
    },
  },
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = (args) => <Table {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Table',
};
