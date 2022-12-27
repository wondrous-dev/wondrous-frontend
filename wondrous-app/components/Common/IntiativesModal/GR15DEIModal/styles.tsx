import { Typography } from '@mui/material';
import styled from 'styled-components';
import { Button } from 'components/Common/button';
import { GradientGR15Horizontal } from 'components/Common/gradients';

export const cancelStyles = () => ({
  '&&': {
    backgroundColor: '#232323',
    color: 'white',
    padding: '6px 24px',
    fontFamily: 'Space Grotesk',
  },
});

export const submitStyles = () => ({
  '&&': {
    background: 'linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%)',
    color: 'white',
    padding: '1px 1px',
    borderRadius: '64px',
    '& .MuiBox-root': {
      background: '#0f0f0f',
      fontFamily: 'Space Grotesk',
      fontSize: 15,
      fontStyle: 'normal',
      fontWeight: 500,
      padding: '6px 24px',
      borderRadius: '64px',
    },
  },
});

export const deleteStyles = () => ({
  '&&': {
    color: 'white',
    border: '1px solid #CB3340',
    padding: '6px 24px',
  },
});

export const IntiativeText = styled(Typography)`
  && {
    background-color: #e2fffa;
    background-image: linear-gradient(90deg, #c1adfe 0%, #83ccb9 35.66%, #fba3b8 74.41%, #ffe98a 99.22%);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 18px;
  }
`;

export const InitiativeContentText = styled(Typography)`
  && {
    color: ${({ theme }) => theme.palette.white};
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  }
`;

export const InitiativeContentMembershipDiv = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 14px;
`;

export const ExploreProjectsButton = styled(Button)`
  && {
    min-height: 0;
    height: 32px;
    width: fit-content;
    margin-top: 14px;
    ${GradientGR15Horizontal}
    button {
      text-transform: capitalize;
      min-height: 0;
      font-size: 15px;
      font-weight: 600;
      font-family: 'Space Grotesk';
      background: #0f0f0f;
    }
  }
`;
export const ExploreProjectsButtonFilled = styled(Button)`
  && {
    min-height: 0;
    height: 32px;
    width: fit-content;
    margin-top: 14px;
    ${GradientGR15Horizontal}
    button {
      text-transform: capitalize;
      min-height: 0;
      font-size: 15px;
      font-weight: 600;
      font-family: 'Space Grotesk';
      background: ${GradientGR15Horizontal};
    }
  }
`;
const styles = {
  white: {
    color: 'white',
  },
  backgroundPaper: {
    background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%);',
  },
  highlightedText: {
    color: '#ccbbff',
    ml: 0.5,
    textTransform: 'capitalize',
  },
  dialogTitle: {
    py: 3,
    px: 0,
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    '&.MuiTypography-root': {
      mx: 3,
    },
  },
  closeButton: {
    cursor: 'pointer',
    height: 34,
    width: 34,
    borderRadius: 20,
    background: '#141414',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default styles;
