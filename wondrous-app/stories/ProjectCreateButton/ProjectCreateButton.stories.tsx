import { ComponentMeta } from '@storybook/react';
import CreateButton from 'components/ProjectProfile/CreateButton';
import React from 'react';

export default {
  title: 'ProjectCreateButton',
  component: CreateButton,
} as ComponentMeta<typeof CreateButton>;

const Template = (args) => <CreateButton {...args} />;

export const Primary = Template.bind({});
Primary.args = { onClick: () => null, text: 'Pods' };
