import styled from 'styled-components';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { OverviewComponent } from 'components/Wrapper/styles';

export const ErrorWrapper = styled(OverviewComponent)`
  && {
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #170c4b 0%, #0f0f0f 100%);
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding-top: 72px;
    gap: 38px;
  }
`;

export const ErrorImage = styled.img`
  max-width: 50%;
`;

export const ErrorHeader = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-style: normal;
    font-weight: 500;
    font-size: 28px;
    line-height: 36px;
    background: linear-gradient(269.64deg, #ff6dd7 21.65%, #dcd26b 71.17%, #06ffa5 82.52%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export const EscapeButton = styled(Button)`
  && {
    align-self: auto;
  }
`;
export const SectionSubheader = styled(Typography)`
  && {
    font-family: var(--font-space-grotesk);
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
    /* identical to box height, or 93% */

    letter-spacing: 0.0025em;

    color: #ffffff;
  }
`;
