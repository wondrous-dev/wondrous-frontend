import styled from 'styled-components';
import Button from '@mui/material/Button';
import { DialogContent, Typography } from '@mui/material';
import palette from 'theme/palette';

export const CategoryHeader = styled(Typography)`
  && {
    color: #ccbbff;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 24px;
  }
`;

export const InterestButton = styled(Button)`
  && {
    color: ${palette.white};
    background: #232323;
    border-radius: 4px;
    width: fit-content;
    text-transform: capitalize;
    font-family: Space Grotesk;
    margin-right: 13px;
    padding: 6.5px 9px;
    margin-bottom: 8px;
  }
`;

export const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  max-width: 80%;
`;

export const StyledDialogContent = styled(DialogContent)`
  && {
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`;
const styles = {
  backgroundPaper: {
    background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 100%);',
    padding: '16px',
    '&::-webkit-scrollbar': {
      display: 'none',
      width: 0,
      height: 0,
    },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
  },
  titleIcon: {
    width: 50,
    height: 50,
    background: '#141414',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 1.5,
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
    borderRadius: '50%',
    background: '#141414',
    padding: 0,
  },
  closeButtonIcon: {
    width: '14px',
    height: '14px',
  },
  dialogActions: {
    py: 3,
    px: 0,
    mx: 3,
    borderTop: '1px solid #363636;',
  },
};

export default styles;
