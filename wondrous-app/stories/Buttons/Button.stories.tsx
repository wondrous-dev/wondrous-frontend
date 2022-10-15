import Grid from '@mui/material/Grid';
import ArrowLeft from 'components/Icons/ArrowLeft';
import ArrowRight from 'components/Icons/ArrowRight';
import React from 'react';
import styled from 'styled-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from 'components/Button';
import { Claim } from 'components/Icons/claimTask';
import { Typography } from '@mui/material';

export default {
  title: 'Inputs/Buttons',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
Buttons are clickable elements that are used to trigger actions. They communicate calls to action to the user and allow users to interact with pages in a variety of ways. Button labels express what action will occur when the user interacts with it.
          
**You can use the following styled-system props.** 
- [Space](https://styled-system.com/api#space) The space utility converts shorthand margin and padding props to margin and padding CSS declarations.
`,
      },
    },
  },
} as ComponentMeta<typeof Button>;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  > div {
    margin: 5px 5px;
  }
`;

const ButtonControlsTemplate: ComponentStory<typeof Button> = (props) => (
  <Container>
    <Button {...props}>Button Controls</Button>
  </Container>
);
export const ButtonControls = ButtonControlsTemplate.bind({});

const ColorTemplate: ComponentStory<typeof Button> = (props) => (
  <Container>
    <Button color="primary">Primary</Button>
    <Button color="grey">Grey</Button>
    <Button color="purple">Purple</Button>
    <Button color="blue">Blue</Button>
    <Button color="red">Red</Button>
  </Container>
);
export const Color = ColorTemplate.bind({});

const OutlinedTemplate: ComponentStory<typeof Button> = (args) => (
  <Container>
    <Button variant="outlined" color="purple">
      Purple
    </Button>
    <Button color="blue" variant="outlined">
      Blue
    </Button>
    <Button color="red" variant="outlined">
      Red
    </Button>
  </Container>
);
export const Outlined = OutlinedTemplate.bind({});

const DisableStateTemplate: ComponentStory<typeof Button> = (props) => (
  <Container>
    <Button color="primary" disabled>
      Primary
    </Button>
    <Button color="grey" disabled>
      Grey
    </Button>
    <Button color="purple" disabled>
      Purple
    </Button>
    <Button color="blue" disabled>
      Blue
    </Button>
    <Button color="red" disabled>
      Red
    </Button>
  </Container>
);
export const DisableState = DisableStateTemplate.bind({});

const ButtonShapesTemplate: ComponentStory<typeof Button> = (props) => (
  <Container>
    <Button color="primary" borderRadius={0}>
      Square
    </Button>
    <Button color="grey" borderRadius={6}>
      Rounded
    </Button>
    <Button color="purple" borderRadius={200}>
      Ellipse
    </Button>
  </Container>
);
export const ButtonShapes = ButtonShapesTemplate.bind({});

const FullWidthTemplate: ComponentStory<typeof Button> = (props) => (
  <Container>
    <Button color="primary" fullWidth>
      Square
    </Button>
    <Button color="grey" fullWidth>
      Rounded
    </Button>
    <Button color="purple" fullWidth>
      Ellipse
    </Button>
  </Container>
);
export const FullWidth = FullWidthTemplate.bind({});

const WithIconTemplate: ComponentStory<typeof Button> = () => (
  <Container>
    <Button color="primary" height={32} buttonTheme={{ paddingX: 10 }}>
      <Claim />
      <Typography marginLeft="10px">Claim</Typography>
    </Button>

    <Grid display="flex">
      <Button color="grey" borderRadius={6} width={30} height={30} buttonTheme={{ paddingX: 0 }}>
        <ArrowLeft />
      </Button>
      <Button color="grey" borderRadius={6} width={30} height={30} buttonTheme={{ paddingX: 0 }}>
        <ArrowRight />
      </Button>
    </Grid>
  </Container>
);
export const WithIcon = WithIconTemplate.bind({});
