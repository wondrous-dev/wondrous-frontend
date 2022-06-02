import styled from 'styled-components';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

export const MultiSelectForm = styled(FormControl)`
  &.MuiFormControl-root {
    position: relative;
    width: 100%;
    min-height: 40px;
    background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);
    padding: 0.1em;
    border-radius: 6px;
    z-index: 1;
    display: flex;
    margin-right: 8px;
  }
  .MuiInputBase-root::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0;
    z-index: -1;
    border-radius: inherit;
    border: 0px;
    background: linear-gradient(90.93deg, #1e1e1e 3.85%, #141414 101.76%);
  }

  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

export const MultiSelectInputLabel = styled(InputLabel)({
  '&.MuiInputLabel-root': {
    transform: 'translateY(100%)',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '0.01em',
    color: '#C4C4C4',

    '& svg': {
      marginRight: 8,
      marginLeft: 12,
    },
  },

  '&.MuiInputLabel-animated': {
    color: '#C4C4C4 !important',
  },
});

export const MultiSelectSelector = styled(Select)({
  '& .MuiSelect-root': {
    position: 'relative',
    boxSizing: 'border-box',
    minHeight: 40,
    zIndex: 1,
    height: 40,
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    display: 'flex',
    alignItems: 'center',
    padding: '0 0 0 10px',

    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&::-ms-overflow-style': 'none',
  },

  '& .MuiChip-root': {
    border: '1px solid #7427FF',
    color: '#CCBBFF',
    background: '#121212',
    margin: 2,
  },

  '& svg': {
    position: 'absolute',
    top: 'calc(50% - 0.1em)',
    right: 12,
  },
});

export const MultiSelectMenuHeader = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const MultiSelectMenuItem = styled(MenuItem)({
  '&.MuiButtonBase-root': {
    background: '#121212',
    height: 35,
    color: '#C4C4C4',
    letterSpacing: '0.01em',
    fontSize: 14,
    lineHeight: '19px',
    borderRadius: 4,
    margin: '4px 0',
  },

  '&.MuiListItem-root.Mui-selected': {
    border: '1px solid #7427FF',
    color: '#CCBBFF',
  },
});

export const MultiSelectCounter = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
  }
`;

export const MultiSelectClearButton = styled(Button)`
  && {
    border: 1px solid #7427ff;
    box-sizing: border-box;
    border-radius: 4px;
    width: 73px;
    height: 28px;

    //text
    font-weight: 500;
    font-size: 13px;
    line-height: 150%;
    color: #ffffff;
  }
`;
