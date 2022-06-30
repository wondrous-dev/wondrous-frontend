import React from 'react';

import { Header } from './Header';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: 'Wondrous/Header',
    component: Header,
    argTypes: {
        title: {
            description: 'specifies extra information about an element',
            options: ['Dashboard'],
            control: { type: 'select' },
            defaultValue: 'Dashboard',
        },
        placeholder: {
            description: 'specifies a hint that describes the expected value of an input field',
            options: ['Search wonder...'],
            control: { type: 'select' },
            defaultValue: 'Search wonder...',
        },
        position: {
            description: 'defines the position of an element in a document',
            options: ['start'],
            control: { type: 'select' },
            defaultValue: 'start',
        },
        href: {
            description: 'stands for hypertext reference',
        },
        target: {
            description: 'specifies a name or a keyword that indicates where to display the response that is received after submitting the form',
            options: ['_blank'],
            control: { type: 'select' },
            defaultValue: '_blank',
        },
        rel: {
            description: 'indicates the relation of the current document to the resource specified in the "href" attribute',
            options: ['noreferrer'],
            control: { type: 'select' },
            defaultValue: 'noreferrer',
        },
        onClick: {
            description: 'Optional. onClick function\n' +
                '`(() => void) | undefined`',
        },
        inputProps: {
            description: '\n' +
                'Represents the props of the KendoReact Input component',
        },
        style: {
            description: 'specifies an inline style for an element',
        },
    }
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => <Header {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    label: 'Header',
};
