import { Typography } from '@mui/material';
import { EmptyGranstIcon } from 'components/Icons/GrantStatusIcons';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { EmptyStateWrapper } from './styles';

const EmptyGrantsBoard = () => (
  <EmptyStateWrapper>
    <EmptyGranstIcon />
    <Typography fontFamily={typography.fontFamily} fontSize="13px" fontWeight={400} color={palette.grey57}>
      No payment needed yet
    </Typography>
  </EmptyStateWrapper>
);

export default EmptyGrantsBoard;
