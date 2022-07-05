import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SVGIcons from './SvgIcons';

export default {
  title: 'Wondrous/Icons/SVG',
  component: SVGIcons,
} as ComponentMeta<typeof SVGIcons>;

const Template: ComponentStory<typeof SVGIcons> = (args) => {
  return (
    <div style={{ background: '#0f0f0f', padding: '40px 0' }}>
      <SVGIcons {...args} />
    </div>
  );
};

export const SVG = Template.bind({});
