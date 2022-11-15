import React from 'react';

import { ComponentMeta } from '@storybook/react';

import PodCard from 'components/Common/PodCard';

export default {
  title: 'PodCard',
  component: PodCard,
} as ComponentMeta<typeof PodCard>;

const Template = (args) => <PodCard {...args} />;

export const Primary = Template.bind({});
Primary.args = { pod: { name: 'engineering', color: 'red', contributorCount: 999, id: '1234' } };
