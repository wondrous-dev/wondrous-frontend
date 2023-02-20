import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import LeaderboardDateTabs from 'components/Leaderboard/LeaderboardDateTabs';

export default {
  title: 'Leaderboard/LeaderboardDateTabs',
  component: LeaderboardDateTabs,
} as ComponentMeta<typeof LeaderboardDateTabs>;

const Template = () => <LeaderboardDateTabs dateToday={new Date()} setFromTime={null} />;

export const Primary = Template.bind({});
