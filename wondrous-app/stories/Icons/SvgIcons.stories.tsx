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

SVG.parameters = {
  docs: {
    source: {
      code: `
// example
import Image from 'next/image';

import createBounty from 'components/Icons/createBounty.svg';

<Image src={createBounty} width={14} height={16} alt="Create bounty" />
      `,
      language: 'jsx',
      type: 'auto',
    },
  },
};
