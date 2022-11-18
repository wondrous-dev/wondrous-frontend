// Button.stories.ts|tsx

import React from 'react';

import { ComponentMeta } from '@storybook/react';

import PodIconName from 'components/Common/PodIconName';

export default {
  title: 'PodIconName',
  component: PodIconName,
} as ComponentMeta<typeof PodIconName>;

export const Primary = () => <PodIconName color="red" name="engineering" />;
