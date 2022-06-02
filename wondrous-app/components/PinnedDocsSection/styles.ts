import { styled } from '@mui/system';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { blueColors } from 'theme/colors';

export const SectionTitleTypography = styled(Typography)(
  `
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 14px;

    color: ${blueColors.blue20};
  }
`
);

export const DocsButton = styled(Button)`
  && {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 10px 8px 10px;
    background-color: ${blueColors.blue800};
    color: ${blueColors.blue20};
    text-transform: capitalize;
  }
`;
