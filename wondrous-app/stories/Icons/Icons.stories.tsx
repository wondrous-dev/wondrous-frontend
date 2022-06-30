import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Icons } from './Icons';

export default {
    title: 'Wondrous/Icons',
    component: Icons,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof Icons>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Icons> = (args) => <Icons {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
    primary: true,
    label: 'Icon',
};