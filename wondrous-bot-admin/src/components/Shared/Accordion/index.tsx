import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ChevronButton,
  StyledAccordionDetails,
  StyledAccordionSummary,
} from './styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Grid } from '@mui/material';
import { useState } from 'react';

const ExpandIcon = () => {
  return (
    <ChevronButton>
      <KeyboardArrowDownIcon
        sx={{
          color: '#FFEBDA',
        }}
      />
    </ChevronButton>
  );
};

export default function AccordionComponent({
  children,
  renderTitle,
  ...props
}) {
  const [expanded, setExpanded] = useState(props.expanded || false);
  const handleChange = (_, value) => setExpanded(value);

  return (
    <Accordion {...props} onChange={handleChange} expanded={expanded} 
    
    >
      <StyledAccordionSummary expandIcon={<ExpandIcon />}>
        {renderTitle ? renderTitle() : null}
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </Accordion>
  );
}
