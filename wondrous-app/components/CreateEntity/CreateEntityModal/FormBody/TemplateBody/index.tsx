import { useState } from 'react';
import { Grid } from '@mui/material';
import { LeftColumnText, StyledGrid } from './styles';

const TemplateBody = ({ entityType }) => {
  const [taskToView, setTaskToView] = useState(null);
  const [taskToViewType, setTaskToViewType] = useState(null);
  // Get org and pod templates
  return (
    <Grid container>
      <StyledGrid item sm={3} md={2}>
        <LeftColumnText>User Created</LeftColumnText>
      </StyledGrid>
      <StyledGrid item sm={9} md={5} />
      <StyledGrid item xs={0} sm={0} md={5} />
    </Grid>
  );
};

export default TemplateBody;
