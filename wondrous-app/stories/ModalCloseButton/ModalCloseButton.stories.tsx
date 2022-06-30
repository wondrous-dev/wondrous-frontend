import React from 'react';

import { ModalCloseButton } from './ModalCloseButton';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: 'Wondrous/ModalCloseButton',
    component: ModalCloseButton,
    argTypes: {
        onClick: {
            description: 'Optional. onClick function\n' +
                '`(() => void) | undefined`',
        },
    }
} as ComponentMeta<typeof ModalCloseButton>;

const Template: ComponentStory<typeof ModalCloseButton> = (args) => <ModalCloseButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    title: 'ModalCloseButton',
};
