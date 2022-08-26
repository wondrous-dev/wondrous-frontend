import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Tag as TagComponent } from 'components/styled/Tag';

export default {
  title: 'Data Display/Tag',
  component: TagComponent,
} as ComponentMeta<typeof TagComponent>;

const Template: ComponentStory<typeof TagComponent> = (args) => (
  <>
    <TagComponent {...args}>Engineering</TagComponent>
    <TagComponent {...args}>QA</TagComponent>
    <TagComponent {...args}>Design</TagComponent>
  </>
);

export const Tag = Template.bind({});
