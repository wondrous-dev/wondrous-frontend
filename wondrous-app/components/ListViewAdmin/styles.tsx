import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const BoldName = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 600;
    font-size: 15px;
    line-height: 23px;
    color: ${palette.white};
  }
`;
