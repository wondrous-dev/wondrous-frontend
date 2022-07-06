import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Typography, Box } from '@mui/material';

import AccordionComponent from 'components/Common/Accordion';

export default {
  title: 'Surfaces/Accordion',
  component: AccordionComponent,
  parameters: {
    docs: {
      description: {
        component: `The accordion component allows the user to show and hide sections of related content on a page.

[Documentation](https://mui.com/material-ui/react-accordion/)

[API](https://mui.com/material-ui/api/accordion/)
`,
      },
    },
  },
  argTypes: {
    title: {
      description: 'Accordion title',
      type: { name: 'string', required: true },
      control: {
        type: 'text',
      },
    },
    disabled: {
      defaultValue: false,
      description: 'If `true`, the component is disabled.',
      control: {
        type: 'boolean',
      },
    },
    expanded: {
      defaultValue: false,
      description:
        'If `true`, expands the accordion, otherwise collapse it. Setting this prop enables control over the accordion.',
      control: {
        type: 'boolean',
      },
    },
    onClick: {
      action: 'onClick',
      description: 'Callback fired when the expand/collapse state is clicked',
    },
  },
} as ComponentMeta<typeof AccordionComponent>;

const Template: ComponentStory<typeof AccordionComponent> = (args) => {
  return (
    <AccordionComponent {...args}>
      <Box sx={{ padding: '15px' }}>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
          lobortis eget.
        </Typography>
      </Box>
    </AccordionComponent>
  );
};
export const Accordion = Template.bind({});

Accordion.args = {
  title: 'Accordion 1',
};
