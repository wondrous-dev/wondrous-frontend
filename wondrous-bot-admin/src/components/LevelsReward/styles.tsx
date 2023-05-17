import { Box } from '@mui/system';
import ScrollBarStyles from 'components/Shared/ScrollBarStyles';
import styled from 'styled-components';

export const LevelsWrapper = styled(Box)`
  && {
    overflow: auto;
    overflow-x: hidden;
    ${ScrollBarStyles}
  }
`;
