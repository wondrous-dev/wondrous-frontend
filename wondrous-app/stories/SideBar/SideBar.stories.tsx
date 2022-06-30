import React from 'react';

import { SideBar } from './SideBar';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: 'Wondrous/SideBar',
    component: SideBar,
    argTypes: {
        variant: {
            description: 'allows you to set all the font variants for a font',
            control: { type: 'select' },
            options: ['permanent'],
            defaultValue: 'permanent',
        },
        anchor: {
            description: 'a piece of text which marks the beginning and/or the end of a hypertext link',
            control: { type: 'select' },
            options: ['left'],
            defaultValue: 'left',
        },
        onClick: {
            description: 'Optional. onClick function\n' +
                '`(() => void) | undefined`',
        },
        key: {
            description: 'help identify which items have been changed, added, or removed',
            options: ['key'],
            control: { type: 'select' },
            defaultValue: 'key',
        },
        className: {
            description: 'used to set or return the value of an element\'s class attribute',
        },
        id: {
            description: 'the unique name of the element, which is used to change its style and refer to it through scripts',
        },
    }
} as ComponentMeta<typeof SideBar>;

const Template: ComponentStory<typeof SideBar> = (args) => <SideBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    primary: true,
    label: 'SideBar',
};
