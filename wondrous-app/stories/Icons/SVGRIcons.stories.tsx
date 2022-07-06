import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Icons from './SVGRIcons';
import {SVG} from "./SvgIcons.stories";

export default {
  title: 'Data Display/Icons/SVGR',
  component: Icons,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    style: {
      description: 'Inner styles',
      type: { name: 'string', required: true },
      control: {
        type: 'object',
      },
    },
    circle: {
      description: 'If `true`, the icon will be inside the circle.',
      control: {
        type: 'boolean',
      },
    },
    ellipseColor: {
      description: 'Ellipse color',
      control: {
        type: 'color',
      },
    },
    fill: {
      description: 'Presentation attribute that defines the color used to paint the element',
      control: {
        type: 'color',
      },
    },
    stroke: {
      description: 'Presentation attribute defining the color used to paint the outline of the shape',
      control: {
        type: 'color',
      },
    },
  },
} as ComponentMeta<typeof Icons>;

const Template: ComponentStory<typeof Icons> = (args) => {
  return (
    <div style={{ background: '#0f0f0f', padding: '40px 0' }}>
      <Icons {...args} />
    </div>
  );
};

export const SVGR = Template.bind({});
SVGR.args = {
  style: {
    width: '60px',
  },
  circle: false,
};

SVGR.parameters = {
  docs: {
    source: {
      code: `
// example
export { Twitter } from 'components/Icons/twitter';

<Twitter style={{ width: '40px', height: '40px' }} alt="Twitter" />
      `,
      language: 'jsx',
      type: 'auto',
    },
  },
};
