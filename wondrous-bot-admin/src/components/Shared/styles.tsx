import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { greyColors } from 'utils/theme/colors';
import {
  ButtonBase,
  Grid,
  Input,
  Menu,
  MenuItem,
  Popover,
  Popper,
  Select,
  Switch,
  SwitchProps,
  TextField,
} from '@mui/material';

export const DefaultLink = styled(Link)`
  && {
    color: ${greyColors.grey10};
    font-size: 14px;
    font-weight: 500;
  }
`;

export const SharedButton = styled(ButtonBase)`
  && {
    background: #000000;
    border-radius: 35px;
    padding: 8px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    color: #ffffff;
  }
`;

export const StyledSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${({ checked }) => (checked ? '#C1B6F6' : '#ABABAB')};
  border-radius: 32px;
  transition: 300ms all;

  &:before {
    transition: 300ms all;
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 35px;
    top: 50%;
    left: 2px;
    background: white;
    transform: ${({ checked }) =>
      checked ? 'translate(0, -50%)' : 'translate(26px, -50%)'};
  }
`;

export const ToggleWrapper = styled(Grid)`
  && {
    height: 32px;
    padding: 4px;
    background: #ebebeb;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
  }
`;

export const ToggleItem = styled(Grid)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ checked }) => (checked ? '#f8642d' : 'transparent')};
    border-radius: 4px;
    max-height: 24px;
    padding: 10px;
    cursor: pointer;
    width: 100%;
  }
`;

export const ButtonIconWrapper = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #c6bbfc;

    border-radius: 6px;

    height: 30px;

    width: 30px;
  }
`;

export const StyledTextFieldSelect = styled(TextField)`
  && {
    height: 40px;
    min-width: 150px;
    max-width: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    background: #e8e8e8;
    border-radius: 6px;

    .MuiInputBase-input {
      padding: 6px 6px 6px 10px;
    }
    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;

export const SharedSecondaryButton = styled(ButtonBase)`
  && {
    display: flex;
    padding: 8px 24px;
    height: 40px;
    min-width: 40px;
    background: ${({ background }) => background || '#84bcff'};
    border-radius: 35px;

    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 150%;
    white-space: nowrap;
    color: #0c002d;
  }
`;

export const RoundedSecondaryButton = styled(SharedSecondaryButton)`
  && {
    padding: 6px;
  }
`;
