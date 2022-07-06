import React from 'react';

import { Text as TextComponent } from 'components/styled/Text';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Wondrous/Typography/Text',
  component: TextComponent,
  parameters: {
    docs: {
      description: {
        component: `Text component based on the [styled-system](https://styled-system.com/api#typography) and includes Typography props.
`,
      },
    },
  },
  argTypes: {
    width: {
      type: 'string',
      description: 'Sets the width of an element’s content',
    },
    display: {
      type: 'string',
      description: 'defines how the element should be shown in the document',
    },
    maxWidth: {
      type: 'string',
      description: 'defines the maximum width of an element',
    },
    minWidth: {
      type: 'string',
      description: 'sets the minimum width of an element',
    },
    height: {
      type: 'string',
      description: 'sets the height of an element',
    },
    maxHeight: {
      type: 'string',
      description: 'defines the maximum height of an element',
    },
    minHeight: {
      type: 'string',
      description: 'defines the minimum height of an element',
    },
    size: {
      type: 'string',
      description: 'defines the size and orientation of the box which is used to represent a page',
    },
    overflow: {
      type: 'string',
      description:
        'controls the display of the content of the block element, if it does not fit entirely and goes beyond the area of the specified dimensions',
    },
    fontSize: {
      type: 'string',
      description: 'sets the size of a font',
    },
    fontFamily: {
      type: 'string',
      description: 'specifies the font for an element.',
    },
    fontWeight: {
      type: 'string',
      description: 'sets how thick or thin characters in text should be displayed',
    },
    textAlign: {
      type: 'string',
      description: 'specifies the horizontal alignment of text in an element',
    },
    lineHeight: {
      type: 'string',
      description: 'specifies the height of a line',
    },
    letterSpacing: {
      type: 'string',
      description: ' increases or decreases the space between characters in a text',
    },
    color: {
      type: 'string',
      description: 'describes values that allow you to define colors and opacity of html elements',
    },
    bg: {
      type: 'string',
      description: 'property sets the background color of an element',
    },
    m: {
      type: 'string',
      description: 'defines the margin on all four sides of an element',
    },
    mt: {
      type: 'string',
      description: 'defines the margin at the top of an element',
    },
    mb: {
      type: 'string',
      description: 'defines the margin at the bottom of an element',
    },
    mr: {
      type: 'string',
      description: 'defines the margin at the right of an element',
    },
    ml: {
      type: 'string',
      description: 'defines the margin at the left of an element',
    },
    p: {
      type: 'string',
      description: 'sets padding on all sides of an element',
    },
    pT: {
      type: 'string',
      description: 'sets padding at the top of an element',
    },
    pB: {
      type: 'string',
      description: 'sets padding at the bottom of an element',
    },
    pR: {
      type: 'string',
      description: 'sets padding at the right of an element',
    },
    pL: {
      type: 'string',
      description: 'sets padding at the left of an element',
    },
  },
} as ComponentMeta<typeof Text>;

const Template: ComponentStory<typeof TextComponent> = (args) => (
  <TextComponent {...args}>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit, quam beatae rerum
    inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
    quibusdam.
  </TextComponent>
);

export const Text = Template.bind({});
Text.args = {
  color: 'white',
};
