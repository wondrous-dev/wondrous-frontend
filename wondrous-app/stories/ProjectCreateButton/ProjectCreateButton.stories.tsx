import React from 'react';

import { ComponentMeta } from '@storybook/react';

import ProjectCreateButton from 'components/Common/ProjectCreateButton';

export default {
  title: 'ProjectCreateButton',
  component: ProjectCreateButton,
} as ComponentMeta<typeof ProjectCreateButton>;

const Template = (args) => <ProjectCreateButton {...args} />;

export const Primary = Template.bind({});
Primary.args = { onClick: () => null, text: 'Pods' };
