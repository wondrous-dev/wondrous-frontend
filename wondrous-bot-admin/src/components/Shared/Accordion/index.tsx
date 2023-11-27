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
          color: 'black',
        }}
      />
    </ChevronButton>
  );
};

export default function AccordionComponent({
  children,
  renderTitle,
  summaryProps = {},
  ...props
}) {
  const [expanded, setExpanded] = useState(props.expanded || false);
  const handleChange = (_, value) => setExpanded(value);

  return (
    <Accordion {...props} onChange={handleChange} expanded={expanded} 
    
    >
      <StyledAccordionSummary 
      {...summaryProps}
      expandIcon={<ExpandIcon />}>
        {renderTitle ? renderTitle() : null}
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </Accordion>
  );
}
