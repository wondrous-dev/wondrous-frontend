import { ComponentMeta } from '@storybook/react';
import PodCards from 'components/ProjectProfile/PodSection';
import React from 'react';
import * as PodCardStories from 'stories/PodCard/PodCard.stories';

export default {
  title: 'PodCards',
  component: PodCards,
} as ComponentMeta<typeof PodCards>;

const Template = (args) => <PodCards {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  pods: Array(10).fill({ ...PodCardStories.Primary.args }),
};

export const Empty = Template.bind({});
Empty.args = {
  pods: [],
};
