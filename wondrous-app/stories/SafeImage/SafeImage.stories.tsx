import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { SafeImage } from './SafeImage';

export default {
  title: 'Wondrous/SafeImage',
  component: SafeImage,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SafeImage>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SafeImage> = (args) => <SafeImage {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  primary: true,
  label: 'SafeImage',
};
