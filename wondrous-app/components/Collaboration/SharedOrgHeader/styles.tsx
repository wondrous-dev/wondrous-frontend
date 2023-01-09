import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import { Box } from '@mui/material';
import typography from 'theme/typography';

export const Separator = styled(Typography)`
  && {
    font-style: normal;
    font-weight: 900;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: 0.03em;
    color: ${palette.grey57};
    transform: scale(2, 1);
    display: flex;
    align-items: center;
  }
`;

export const SmallSeparator = styled(Typography)`
  && {
    font-style: normal;
    font-weight: 700;
    font-size: 8px;
    line-height: 18px;
    letter-spacing: 0.03em;
    color: ${palette.white};
    transform: scale(1.5, 1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const SeparatorDiv = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 8px;
`;

export const OrgName = styled(Typography)`
  && {
    font-weight: 500;
    font-family: ${typography.fontFamily};
    color: ${palette.white};
    margin-left: 7px;
    font-size: 14px;
  }
`;

export const OrgContainer = styled(Box)`
  && {
    display: flex;
    align-items: center;
  }
`;
