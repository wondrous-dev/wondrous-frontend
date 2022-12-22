import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import styled from 'styled-components';
import { ModalCloseButton } from 'components/Common/ModalCloseButton';
import AndroidSwitch from 'components/Common/AndroidSwitch';
import palette from 'theme/palette';

export const StyledBox = styled(Box)`
  width: 682px;
  border-radius: 6px;
  background: linear-gradient(180deg, ${palette.black95} 0%, ${palette.black97} 100%);
  margin: 140px auto 0;
  padding: 26px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(169.47deg, ${palette.grey75}7f 7.84%, ${palette.black92}7f 108.71%);
    mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
    mask-composite: xor;
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
  background: ${palette.black97};
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
    color: ${palette.white};
  }
`;

export const TextSubheading = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 20px;
    color: ${palette.blue20};
  }
`;

export const CloseButton = styled(ModalCloseButton)`
  width: 34px;
  height: 34px;
`;

export const StyledDivider = styled(Divider)`
  && {
    background: ${palette.grey85};
    height: 1px;
    border-radius: 6px;
    width: 630px;
    margin: 30px auto 0;
  }
`;

export const InviteThruLinkLabel = styled(Typography)`
  && {
    color: ${palette.blue20};
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
  background: ${palette.background.default};
  border-radius: 6px;
  height: 40px;
  width: 351px;
  padding: 0;

  .MuiInputBase-input {
    color: ${palette.grey250};
  }

  .MuiOutlinedInput-input {
    padding: 11px 15px;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: linear-gradient(270deg, ${palette.background.default} 2.96%, transparent 62.5%);
  }
`;

export const InviteThruLinkFormControlSelect = styled(FormControl)``;

export const StyledSelect = styled(Select)`
  && {
    background: ${palette.background.default};
    width: 141px;
    max-width: 100%;
    height: 40px;
    color: ${palette.white};
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
  <StyledSelect {...props} capitalize svgColor={palette.blue20} rounded MenuProps={{ classes: { paper: className } }} />
))`
  &.MuiPaper-root {
    background: linear-gradient(180deg, ${palette.black95} 0%, ${palette.black97} 109.19%);
    width: 141px;
    color: ${palette.white};
  }
  &.MuiPaper-root > .MuiList-padding {
    padding: 0;
  }
`;

export const InviteThruLinkMenuItem = styled(MenuItem)`
  && {
    background: ${palette.black98};
    color: ${palette.grey250};
    margin: 6px;
    border-radius: 6px;
    font-size: 13px;
    border: 1px solid transparent;
    height: 34px;
  }

  &&:hover {
    background: ${palette.black};
    border: 1px solid ${palette.highlightPurple};
  }

  .MuiListItem-root.Mui-selected,
  .MuiListItem-root.Mui-selected:hover {
    background: none;
  }
`;

export const InviteThruLinkButtonLabel = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 14px;
    margin-left: 25px;
    font-weight: 500;
  }
`;

export const InviteThruLinkButtonSuccessLabel = styled(InviteThruLinkButtonLabel)`
  && {
    background: ${palette.grey57};
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
    color: ${palette.grey250};
    font-size: 14px;
  }
`;

export const InviteThruEmailLabel = styled(Typography)`
  && {
    color: ${palette.blue20};
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
  background: ${palette.background.default};
  border-radius: 6px 0 0 6px;
  height: 40px;
  width: 337px;
  border: 1px solid transparent;

  .MuiInputBase-input {
    color: ${palette.grey250};
    height: 20px;
    padding: 10px 15px;
  }

  .MuiOutlinedInput-input {
    padding: 11px 15px;
  }
`;

export const InviteButton = styled(Button)`
  && {
    border: 1px solid ${palette.black70};
    background: ${palette.background.default};
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
      background: ${palette.black70};
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        270deg,
        ${palette.blue20} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.highlightBlue} 103.12%
      );
      mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
      mask-composite: xor;
      padding: 1px;
      border-radius: 180px;
    }
  }
`;

export const InviteThruEmailButtonLabel = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 14px;
    font-weight: 500;
  }
`;
