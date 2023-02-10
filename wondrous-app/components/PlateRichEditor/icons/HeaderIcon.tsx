import { Typography } from '@mui/material';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const HeaderIcon = ({ title }) => (
  <Typography fontFamily={typography.fontFamily} fontWeight={600} fontSize={14} color={palette.grey250}>
    {title}
  </Typography>
);
