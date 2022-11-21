import { styled } from '@mui/system';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import palette from 'theme/palette';

export const SectionTitleTypography = styled(Typography)(
  `
  && {
    font-family: var(--font-space-grotesk);
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 14px;

    color: ${palette.blue20};
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
    background-color: ${palette.blue800};
    color: ${palette.blue20};
    text-transform: capitalize;
  }
`;
