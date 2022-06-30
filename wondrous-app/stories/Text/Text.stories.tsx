import React from 'react';

import { Text2 } from './Text';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
    title: 'Wondrous/Text',
    component: Text2,
    argTypes: {
        width: {
            type: 'radio',
            description: 'Sets the width of an element’s content',
            options: ['{1/2}', '{256}', '2em', '{[ 1, 1/2 ]}', 'medium'],
        },
        display: {
            type: 'display',
            description: 'defines how the element should be shown in the document',
            options: ['inline-block', '{[block, inline-block ]}'],
        },
        maxWidth: {
            type: 'maxWidth',
            description: 'defines the maximum width of an element',
            options: ['{1024}', '{[ 768, null, null, 1024 ]}'],
        },
        minWidth: {
            type: 'minWidth',
            description: 'sets the minimum width of an element',
            options: ['{128}', '{[ 96, 128 ]}'],
        },
        height: {
            type: 'height',
            description: 'sets the height of an element',
            options: ['{64}', '{[ 48, 64 ]}'],
        },
        maxHeight: {
            type: 'maxHeight',
            description: 'defines the maximum height of an element',
            options: ['{512}', '{[ 384, 512 ]}'],
        },
        minHeight: {
            type: 'minHeight',
            description: 'defines the minimum height of an element',
            options: ['{512}', '{[ 384, 512 ]}'],
        },
        size: {
            type: 'size',
            description: 'defines the size and orientation of the box which is used to represent a page',
            options: ['{32}', '{[ 32, 48 ]}'],
        },
        overflow: {
            type: 'overflow',
            description:
                'controls the display of the content of the block element, if it does not fit entirely and goes beyond the area of the specified dimensions',
            options: ['hidden'],
        },
        fontSize: {
            type: 'fontSize',
            description: 'sets the size of a font',
            options: ['{3}', '{32}'],
        },
        fontFamily: {
            type: 'fontSize',
            description: 'specifies the font for an element.',
            options: ['mono'],
        },
        fontWeight: {
            type: 'sets how thick or thin characters in text should be displayed',
            description: ' font weight',
            options: ['bold'],
        },
        textAlign: {
            type: 'textAlign',
            description: 'specifies the horizontal alignment of text in an element',
            options: ['center', '{[ center, left ]}'],
        },
        lineHeight: {
            type: 'lineHeight',
            description: 'specifies the height of a line',
            options: ['1.25'],
        },
        letterSpacing: {
            type: ' increases or decreases the space between characters in a text',
            description: ' letter spacing',
            options: ['0.1em'],
        },
        color: {
            type: 'color',
            description: 'describes values that allow you to define colors and opacity of html elements',
            options: ['blue', 'gray.0', '#f00'],
        },
        bg: {
            type: 'backgroundColor',
            description: 'property sets the background color of an element',
            options: ['blue'],
        },
        m: {
            type: 'margin',
            description: 'defines the margin on all four sides of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
        mt: {
            type: 'marginTop',
            description: 'defines the margin at the top of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
        mb: {
            type: 'marginBottom',
            description: 'defines the margin at the bottom of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
        mr: {
            type: 'marginRight',
            description: 'defines the margin at the right of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
        ml: {
            type: 'marginLeft',
            description: 'defines the margin at the left of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
        p: {
            type: 'padding',
            description: 'sets padding on all sides of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
        pT: {
            type: 'paddingTop',
            description: 'sets padding at the top of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
        pB: {
            type: 'paddingBottom',
            description: 'sets padding at the bottom of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
        pR: {
            type: 'paddingRight',
            description: 'sets padding at the right of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
        pL: {
            type: 'paddingLeft',
            description: 'sets padding at the left of an element',
            options: ['{2}', '{-2}', 'auto', '{[ 2, 3 ]}'],
        },
    },
} as ComponentMeta<typeof Text2>;

const Template: ComponentStory<typeof Text2> = (args) => <Text2 {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    title: 'Text',
};
