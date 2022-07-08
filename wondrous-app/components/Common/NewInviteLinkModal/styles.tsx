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
import { ModalCloseButton } from '../ModalCloseButton';
import { Button as ButtonComponent } from '../button';
import { AndroidSwitch } from '../../CreateEntity/createEntityModal';
import palette from 'theme/palette';
import { capitalize } from 'lodash';

export const StyledModal = styled(Modal)``;

export const StyledBox = styled(Box)`
  width: 682px;
  border-radius: 6px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  margin: 140px auto 0;
  padding: 26px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.5) 7.84%, rgba(35, 35, 35, 0.5) 108.71%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
    border-radius: 6px;
  }
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
  display: flex;
  gap: 6px;
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
    font-weight: bold;
    font-size: 20px;
    color: #ccbbff;
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
  }
`;

export const InviteThruLinkInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 12px;
`;

export const InviteThruLinkTextField = styled(TextField)`
  background: #0f0f0f;
  border-radius: 6px;
  height: 40px;
  width: 351px;
  padding: 0;

  .MuiInputBase-input {
    color: #c4c4c4;
  }

  .MuiOutlinedInput-input {
    padding: 11px 15px;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: linear-gradient(270deg, #0f0f0f 2.96%, rgba(15, 15, 15, 0) 62.5%);
  }
`;

export const InviteThruLinkFormControlSelect = styled(FormControl)``;

export const StyledSelect = styled(Select)`
  && {
    background: #0f0f0f;
    width: 141px;
    max-width: 100%;
    height: 40px;
    color: #fff;
    border-radius: ${(props) => (props.rounded ? '6px' : '0')};
    font-size: 14px;
    text-transform: ${(props) => (props.capitalize ? 'capitalize' : 'inherit')};
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

  & .MuiSvgIcon-root {
    color: ${(props) => props.svgColor};
  }
`;

export const InviteThruLinkSelect = styled(({ className, ...props }) => (
  <StyledSelect
    {...props}
    capitalize={true}
    svgColor="#CCBBFF"
    rounded={true}
    MenuProps={{ classes: { paper: className } }}
  />
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

export const InviteThruLinkButtonLabel = styled(Typography)`
  && {
    color: white;
    font-size: 14px;
    margin-left: 25px;
    font-weight: 500;
  }
`;

export const InviteThruLinkButtonSuccessLabel = styled(InviteThruLinkButtonLabel)`
  && {
    background: #7a7a7a;
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
  gap: 21px;
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

export const InviteButton = styled(Button)`
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
    justify-content: ${(props) => (props.justifyCenter ? 'center' : 'space-between')};
    padding: ${(props) => (props.rightPadding ? '0 12px 0 0' : '0')};
    border-radius: 100px;

    :hover {
      background: #353535;
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
      padding: 1px;
      border-radius: 180px;
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
