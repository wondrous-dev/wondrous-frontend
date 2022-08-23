import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Grid from '@mui/material/Grid';

import SVGIcons from './SvgIcons';

export default {
  title: 'Data Display/Icons/SVG',
  component: SVGIcons,
} as ComponentMeta<typeof SVGIcons>;

const Template: ComponentStory<typeof SVGIcons> = (args) => {
  return (
    <Grid container spacing={5} sx={{ backgroundColor: '#0f0f0f' }}>
      <SVGIcons {...args} />
    </Grid>
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
