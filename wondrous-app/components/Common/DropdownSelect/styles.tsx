import styled, { css } from 'styled-components';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import palette from 'theme/palette';

export const CreateFormSelectBlock = styled.div`
  max-width: 260px;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const CreateFormSelectBlockTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
    margin-bottom: 0;
  }
`;

export const CreateFormControl = styled(FormControl)({
  '& .MuiFormControl-root': {
    background: '#0f0f0f',
    zIndex: 10,
  },

  '& .MuiInput-underline:before': {
    display: 'none',
  },
  '& .MuiInput-underline:after': {
    display: 'none',
  },
});

export const CreateFormInputLabel = styled(InputLabel)({
  '&.MuiFormLabel-root': {
    fontSize: 14,
    lineHeight: '30px',
    letterSpacing: '0.01em',
    color: '#C4C4C4',
    zIndex: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 15px',
    height: `calc(100% - 14px)`,
    cursor: 'pointer',

    '& svg': {
      marginRight: 7,
    },
  },

  '&.MuiInputLabel-animated': {
    color: '#C4C4C4 !important',
  },
});

export const CreateFormSelect = styled(Select)`
  && {
    background: ${({ theme, disabled }) => (disabled ? theme.palette.grey920 : theme.palette.grey940)};
    border-radius: 6px;
    width: 100%;
    height: 32px;
    padding: 0 15px;
    position: relative;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: ${palette.white};
    margin-top: 20px;
    z-index: 100;
    cursor: pointer;

    .MuiSelect-select.MuiSelect-select {
      display: flex;
      align-items: center;
    }

    & svg {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      z-index: -1;
      color: #c4c4c4;
    }

    & .MuiSelect-select.MuiSelect-select {
      display: flex;
    }

    & .Mui-disabled {
      color: white !important;
      pointer-events: none;
      -webkit-text-fill-color: #c4c4c4;
    }

    & svg.Mui-disabled {
      opacity: 0;
    }
  }
`;

export const CreateFormMenuItem = styled(MenuItem)`
  && {
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: ${palette.white};
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin-bottom: 4px;

    &.Mui-selected {
      background: #000000;
      border: 1px solid #7427ff;
    }

    &.Mui-selected {
      background: #000000;
      border: 1px solid #7427ff;
    }

    &:hover {
      background: #121212;
    }

    & span {
      margin-left: 5px;
      opacity: 0.5;
    }
  }
`;

export const CreateFormMenuItemIcon = styled.div`
  display: flex;
  margin: 0 8px 0 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    right: 30px !important;
  }
`;

// The styles below will make styles for dropdown
// for the new design
export const newDropdownStyles = css`
  ${CreateFormSelectBlock} {
    margin-top: 0 !important;

    .MuiInput-underline::after,
    .MuiInput-underline:before {
      display: none;
    }
  }

  ${CreateFormSelect} {
    margin-top: 0;
    z-index: 100;
    cursor: pointer;
  }

  ${CreateFormSelect} {
    margin-top: 0;
    z-index: 100;
    cursor: pointer;
  }
`;
