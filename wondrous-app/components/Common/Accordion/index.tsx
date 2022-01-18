import React from 'react';

import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
// import AccordionDetails from '@mui/material/AccordionDetails';
import { AccordionComp, AccordionDetails } from './styles';

import { Chevron } from '../../Icons/sections';

export default function Accordion({ children, title }) {
  return (
    <AccordionComp>
      <AccordionSummary expandIcon={<Chevron />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </AccordionComp>
  );
}
