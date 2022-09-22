import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import TaskPriorityChip from 'components/Common/TaskPriority/TaskPriorityChip';

export default {
  title: 'Data Display/PriorityChip',
  component: TaskPriorityChip,
} as ComponentMeta<typeof TaskPriorityChip>;

const LowTemplate: ComponentStory<typeof TaskPriorityChip> = (args) => <TaskPriorityChip {...args} value="low" />;
export const Low = LowTemplate.bind({});

const MediumTemplate: ComponentStory<typeof TaskPriorityChip> = (args) => <TaskPriorityChip {...args} value="medium" />;
export const Medium = MediumTemplate.bind({});

const HighTemplate: ComponentStory<typeof TaskPriorityChip> = (args) => <TaskPriorityChip {...args} value="high" />;
export const High = HighTemplate.bind({});

const UrgentTemplate: ComponentStory<typeof TaskPriorityChip> = (args) => <TaskPriorityChip {...args} value="urgent" />;
export const Urgent = UrgentTemplate.bind({});
