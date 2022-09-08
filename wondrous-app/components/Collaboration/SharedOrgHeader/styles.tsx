import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const Separator = styled(Typography)`
  && {
    font-style: normal;
    font-weight: 900;
    font-size: 20px;
    line-height: 18px;
    letter-spacing: 0.03em;
    color: ${palette.grey57};
    transform: scale(2, 1);
    display: flex;
    align-items: center;
  }
`;
