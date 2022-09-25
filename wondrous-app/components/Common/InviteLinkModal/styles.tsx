import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Select,
  Menu,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
} from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import { ModalCloseButton } from '../ModalCloseButton';
import { Button as ButtonComponent } from '../button';
import { AndroidSwitch } from '../../CreateEntity/CreatePodModal';

export const StyledModal = styled(Modal)``;

export const StyledBox = styled(Box)`
  width: 682px;
  border-radius: 6px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  margin: 140px auto 0;
  padding: 26px;
`;
export const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const IconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 100%;
`;

export const PersonAddIconWrapper = styled.div`
  background: #141414;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 10%;
`;

export const TextHeadingWrapper = styled.div`
  text-align: left;
  margin-left: 16px;
`;

export const TextHeading = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 20px;
    color: #fff;
  }
`;

export const TextSubheading = styled(Typography)`
  && {
    font-size: 14px;
    color: #c4c4c4;
  }
`;

export const CloseButton = styled(ModalCloseButton)`
  width: 34px;
  height: 34px;
`;

export const StyledDivider = styled(Divider)`
  && {
    background: #363636;
    height: 1px;
    border-radius: 6px;
    width: 630px;
    margin: 30px auto 0;
  }
`;

export const InviteThruLinkLabel = styled(Typography)`
  && {
    color: #ccbbff;
    font-size: 14px;
    font-weight: 500;
    margin-top: 32px;
    margin-left: 12px;
  }
`;

export const InviteThruLinkInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

export const InviteThruLinkTextField = styled(TextField)`
  background: #0f0f0f;
  border-radius: 6px 0 0 6px;
  height: 40px;
  width: 351px;
  padding: 0;

  .MuiInputBase-input {
    color: #c4c4c4;
  }

  .MuiOutlinedInput-input {
    padding: 11px 15px;
  }
`;

export const InviteThruLinkFormControlSelect = styled(FormControl)``;

export const StyledSelect = styled(Select)`
  && {
    background: #0f0f0f;
    width: 141px;
    height: 40px;
    color: #fff;
    border-radius: 0;
    font-size: 14px;
  }

  & .MuiSelect-root {
    padding-left: 12px;
  }

  & .MuiInputBase-root {
    border-radius: 0 6px 6px 0;
  }

  & .MuiInput-underline {
    :hover:not(.Mui-disabled)::before {
      border: none;
      ::before {
        border: none;
      }
      ::before {
        border: none;
      }
    }
  }
`;

export const InviteThruLinkSelect = styled(({ className, ...props }) => (
  <StyledSelect {...props} MenuProps={{ classes: { paper: className } }} />
))`
  &.MuiPaper-root {
    background: linear-gradient(180deg, #1e1e1e 0%, #141414 109.19%);
    width: 141px;
    color: #fff;
  }
  &.MuiPaper-root > .MuiList-padding {
    padding: 0;
  }
`;

export const InviteThruLinkMenuItem = styled(MenuItem)`
  && {
    background: #121212;
    color: #c4c4c4;
    margin: 6px;
    border-radius: 6px;
    font-size: 13px;
    border: 1px solid transparent;
    height: 34px;
  }

  &&:hover {
    background: rgba(0, 0, 0, 1);
    border: 1px solid #7427ff;
  }

  .MuiListItem-root.Mui-selected,
  .MuiListItem-root.Mui-selected:hover {
    background: none;
  }
`;

export const InviteThruLinkButton = styled(Button)`
  && {
    border: 1px solid #353535;
    background: #0f0f0f;
    font-weight: 400;
    width: 137px;
    flex-basis: 137px;
    height: 40px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px 0 0;

    :hover {
      background: #353535;
    }
  }
`;

export const InviteThruLinkButtonLabel = styled(Typography)`
  && {
    color: white;
    font-size: 14px;
    margin-left: 25px;
  }
`;

export const InviteThruLinkButtonSuccessLabel = styled(InviteThruLinkButtonLabel)`
  && {
    background: #ffffff;
    background: -webkit-linear-gradient(to bottom, #ffffff 0%, #06ffa5 100%);
    background: -moz-linear-gradient(to bottom, #ffffff 0%, #06ffa5 100%);
    background: linear-gradient(to bottom, #ffffff 0%, #06ffa5 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 11px;
  }
`;

export const LinkSwitch = styled(({ ...props }) => (
  <FormControlLabel {...props} control={<AndroidSwitch />} label={props.label} />
))`
  margin-top: 12px;

  .MuiTypography-body1 {
    color: #c4c4c4;
    font-size: 14px;
  }
`;

export const InviteThruEmailLabel = styled(Typography)`
  && {
    color: #ccbbff;
    font-size: 14px;
    font-weight: 500;
    margin-top: 32px;
  }
`;

export const InviteThruEmailTextFieldButtonWrapper = styled.div`
  display: flex;
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
`;

export const InviteThruEmailTextFieldSelectWrapper = styled.div``;

export const InviteThruEmailTextField = styled(TextField)`
  background: #0f0f0f;
  border-radius: 6px 0 0 6px;
  height: 40px;
  width: 337px;
  border: 1px solid transparent;

  .MuiInputBase-input {
    color: #c4c4c4;
    height: 20px;
    padding: 10px 15px;
  }

  .MuiOutlinedInput-input {
    padding: 11px 15px;
  }
`;

export const InviteThruEmailButton = styled(ButtonComponent)`
  && {
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    min-height: 0;
    height: 40px;
    font-weight: 400;
    width: 137px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      border-radius: 6px;
      width: 135px;
      height: 37px;
    }
  }
`;

export const InviteThruEmailButtonLabel = styled(Typography)`
  && {
    color: white;
    font-size: 14px;
    font-weight: 500;
  }
`;
