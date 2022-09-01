import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import {
  background,
  black,
  white,
  greyColors,
  redColors,
  blueColors,
  greenColors,
  yellowColors,
  violetColors,
  orangeColors,
  purpleColors,
  blackColors,
  midnight,
  highlightBlue,
  highlightPurple,
  electricViolet,
  tundora,
  mineShaft,
} from 'theme/colors';

const palette = {
  // primary: {
  //   main: '#161616',
  //   contrastText: white,
  // },
  // secondary: {
  //   main: blueColors.blue400,
  //   contrastText: white,
  // },
  // success: {
  //   main: greenColors.green400,
  //   contrastText: white,
  // },
  // background: {
  //   default: background,
  // },
  white,
  black,
  midnight,
  highlightBlue,
  highlightPurple,
  electricViolet,
  tundora,
  mineShaft,
  ...greyColors,
  ...redColors,
  ...blueColors,
  ...greenColors,
  ...yellowColors,
  ...violetColors,
  ...orangeColors,
  ...purpleColors,
  ...blackColors,
};

const ColorComponent = () => (
  <Grid container spacing={5} sx={{ backgroundColor: '#eae8e8' }}>
    {Object.keys(palette).map((key) => (
      <Grid key={key} item>
        <Box sx={{ height: '30px', backgroundColor: palette[key] }} />
        <div>
          <strong>{key}</strong>
        </div>
        <div>
          <strong>hex: </strong>
          {palette[key]}
        </div>
      </Grid>
    ))}
  </Grid>
);

export default {
  title: 'Data Display/Colors',
  component: ColorComponent,
} as ComponentMeta<typeof ColorComponent>;

const Template: ComponentStory<typeof ColorComponent> = (args) => <ColorComponent />;

export const Colors = Template.bind({});
