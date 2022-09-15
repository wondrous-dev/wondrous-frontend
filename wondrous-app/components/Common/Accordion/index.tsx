import React from 'react';

import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { AccordionComp, AccordionDetails, Title } from './styles';

import { Chevron } from '../../Icons/sections';

// https://mui.com/api/accordion/
export default function Accordion({ children, title, ...props }) {
  return (
    <AccordionComp {...props}>
      <AccordionSummary expandIcon={<Chevron />}>
        <Title>{title}</Title>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </AccordionComp>
  );
}
