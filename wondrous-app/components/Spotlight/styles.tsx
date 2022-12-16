import styled from 'styled-components';
import Grid from '@mui/material/Grid';
import palette from 'theme/palette';
import TextField from '@mui/material/TextField';
import typography from 'theme/typography';
import { Drawer, Modal } from '@mui/material';
import { SearchInputWrapper } from 'components/GlobalSearch/styles';

export const Wrapper = styled(Grid)`
  && {
    position: absolute;
    top: 50%;
    width: 50vw;
    background: ${palette.grey900};
    border: 1px solid ${palette.grey79};
    left: 50%;
    border-radius: 6px;
    transform: translate(-50%, -50%);
    &:focus {
      outline: none;
    }
    ${SearchInputWrapper} {
      width: 100%;
    }
    .MuiOutlinedInput-root {
      width: 100%;
      border-top-left-radius: 150px;
      border-bottom-left-radius: 150px;
    }
    .MuiInputAdornment-positionStart {
      svg {
        path {
          stroke: ${palette.highlightBlue};
        }
      }
    }
    ${({ theme }) => theme.breakpoints.down('sm')} {
      width: 100%;
      padding: 42px 14px 0px 14px;
      background: transparent;
      height: 100%;
      border: none;
      justify-content: space-between;
      position: unset;
      transform: unset;
    }
  }
`;

export const MuiDrawer = styled(Drawer)`
  && {
    .MuiPaper-root {
      height: fit-content;
      min-height: 10%;
      border-radius: ${({anchor}) => anchor === 'top' ? '0px 0px 14px 14px' : '14px 14px 0px 0px'};
      background: ${palette.black92};
    }
  }
`;

export const Input = styled(TextField)`
  &.MuiTextField-root {
    width: 100%;
    border-bottom: 1px solid ${palette.grey79};
  }
  input {
    height: 2rem;
    width: 100%;
    border: 0;
    color: ${palette.white};
    &::placeholder {
      color: ${palette.grey57};
    }
  }
`;

export const SpotlightFooter = styled(Grid)`
  && {
    background: ${palette.black97};
    border-radius: 0px 0px 6px 6px;
    padding: 14px;
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 700;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      display: none;
    }
  }
`;

export const LeftArrowButton = styled.button`
  background: ${palette.grey99};
  border: none;
  height: 48px;
  width: 48px;
  display: flex;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  svg {
    path {
      stroke: ${palette.white};
    }
  }
`;