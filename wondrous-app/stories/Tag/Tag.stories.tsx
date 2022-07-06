import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Tag as TagComponent } from 'components/styled/Tag';

export default {
  title: 'Wondrous/Tag',
  component: TagComponent,
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof TagComponent> = (args) => <>
  <TagComponent {...args}>Engineering</TagComponent>
  <TagComponent {...args}>QA</TagComponent>
  <TagComponent {...args}>Design</TagComponent>
</>;

export const Text = Template.bind({});
