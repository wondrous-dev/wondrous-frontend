import styled from 'styled-components';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { Blue20, Blue800 } from 'theme/colors';

export const SectionTitleTypography = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 14px;

    color: ${Blue20};
  }
`;

export const DocsButton = styled(Button)`
  && {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 10px 8px 10px;
    background-color: ${Blue800};
    color: ${Blue20};
  }
`;
