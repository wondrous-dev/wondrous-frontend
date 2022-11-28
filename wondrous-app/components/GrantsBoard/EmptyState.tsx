import { Typography } from '@mui/material';
import { EmptyGranstIcon } from 'components/Icons/GrantStatusIcons';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { EmptyStateWrapper, CreateGrantButton } from './styles';

const EmptyGrantsBoard = ({ handleCreate }) => (
  <EmptyStateWrapper>
    <EmptyGranstIcon />
    <Typography fontFamily={typography.fontFamily} fontSize="13px" fontWeight={400} color={palette.grey57}>
      No grants yet
    </Typography>
    <CreateGrantButton type="button" onClick={handleCreate}>
      Create grant
    </CreateGrantButton>
  </EmptyStateWrapper>
);

export default EmptyGrantsBoard;
