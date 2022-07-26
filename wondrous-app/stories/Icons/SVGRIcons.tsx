import * as icons from './SVGRIconsList';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import React from 'react';

const SVGRIcons = (props) => {
  return Object.keys(icons).map((key) => {
    const Icon = icons[key];

    return (
      <Grid item key={key} sx={{ color: 'white', textAlign: 'center' }} xs={3}>
        <Box
          sx={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ' > svg': {
              maxHeight: '50px',
            },
          }}
        >
          <Icon {...props} />
        </Box>

        <Box sx={{ wordBreak: 'break-all' }}> {key}</Box>
      </Grid>
    );
  });
};

export default SVGRIcons as any;
