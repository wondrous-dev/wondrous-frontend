import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import styled from 'styled-components';
import { ModalCloseButton } from '../ModalCloseButton';
import { Button as ButtonComponent } from '../button';
import { AndroidSwitch } from '../../CreateEntity/CreatePodModal';
import { SafeImage } from '../Image';
import DefaultUserImage from '../Image/DefaultUserImage';

export const StyledModal = styled(Modal)``;

export const StyledBox = styled(Box)`
  width: 682px;
  border-radius: 6px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  margin: 60px auto;
  height: auto;
  max-height: ${(props) => (props.isUniversal ? 'unset' : '85%')};
  position: relative;
`;
export const HeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TopDivider = styled.div`
  padding: 26px;

  width: 100%;
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
    //background-clip: text;
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
    color: #ccbbff;
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

export const DashedLine = styled.div`
  width: 100%;
  border-bottom: 0.5px dashed #4b4b4b;
  margin: 19px 0;
`;
const ProfilePictureStyles = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
};
export const UserProfilePicture = (props) => <SafeImage src={props?.src} style={ProfilePictureStyles} />;

export const DefaultProfilePicture = () => <DefaultUserImage style={ProfilePictureStyles} />;

export const SelectUserContainer = styled.div`
  width: 100%;
  margin-bottom: 18px;
  display: flex;
  flex-direction: ${(props) => (props.isUniversal ? 'row-reverse' : 'row')};
  justify-content: space-between;
`;
export const SearchUserBox = styled.div`
  width: 69%;
  position: relative;
`;
export const SearchUserContainer = styled.div`
  width: 100%;
  height: 42px;
  background: black;
  display: flex;
  padding: 10px 14px;
  border-radius: 6px;
  align-items: center;

  input {
    flex: auto;
    border: none;
    outline: none;
    height: 100%;
    color: #ffffff;
    background: inherit;
    font-size: 16px;
    line-height: 16px;

    &::placeholder {
      font-size: 15px;
      line-height: 19px;
      color: #7a7a7a;
    }
  }
`;

export const DisplaySearchedUserContainer = styled.div`
  background: #1d1d1d;
  border: 1px solid #424242;
  box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.75);
  border-radius: 6px;
  position: absolute;
  width: 100%;
  z-index: 2;
  padding: 12px;
  top: 50px;
  left: 0;
  max-height: 400px;
  overflow-y: auto;
  -ms-overflow-style: none;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #606060;
  }

  &::-webkit-scrollbar {
    height: 0;
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #c4c4c4;
  }
`;

export const DisplaySearchedUser = styled.div`
  display: flex;
  background: #121212;
  border-radius: 4px;
  cursor: pointer;
  padding: ${(props) => (props.type === 'email' ? '15px' : '8px')};
  align-items: center;
  margin-bottom: 8px;

  p {
    margin: 0;
    color: #ffffff;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    margin-left: 14px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: linear-gradient(269.74deg, #232323 8.24%, #161616 72.13%);
  }
`;

export const EmptySearch = styled.div`
  color: white;
  margin: 0;
`;

export const RoleContainer = styled.div`
  position: relative;
  width: 28%;
`;
export const SelectRoleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background: black;
  border-radius: 6px;
  padding: 9px 12px;
  justify-content: space-between;
  cursor: pointer;
  border: ${(props) => (props.dropActive ? '1px solid #4b4b4b' : '1px solid black')};
`;
export const RoleText = styled.p`
  width: max-content;
  min-width: 80px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 7px;
  font-size: 13px;
  margin: 0 !important;
  border-radius: 56px;
  height: 24px;
  border: ${(props) =>
    props.role_type === 'contributor' || props.role_type === 'engineering'
      ? '1px solid #FF9933;'
      : props.role_type === 'core team' || props.role_type === 'terry_role'
      ? '1px solid #EB96EB;'
      : '1px solid #7ECC49;'};
`;

export const SelectRoleBox = styled.div`
  position: absolute;
  top: 50px;
  left: 0;
  width: 250px;
  background: #1d1d1d;
  padding: 12px;
  border: 1px solid #4b4b4b;
  box-shadow: 0px 34px 84px rgba(0, 0, 0, 0.55);
  border-radius: 6px;
  transform: ${(props) => (props.show ? 'scale(1)' : 'scale(0)')};
  transform-origin: top left;
  transition: transform 0.2s ease;
  z-index: 2;
`;

export const IndividualRoleBox = styled.div`
  background: #121212;
  border-radius: 4px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid;
  position: relative;
  background-clip: padding-box;

  svg {
    color: ${(props) => (props.active ? '#7427ff' : '#474747')};
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: ${(props) => (props.active ? '-2px' : '0')};
    border-radius: inherit;
    background: linear-gradient(89.61deg, #ff9933 13.05%, #7427ff 90.81%);
  }
`;

export const UserBox = styled.div`
  width: 100%;
  margin-bottom: 24px;
  height: auto;
  max-height: 400px;
`;

export const UsersDetailsBox = styled.div`
  width: 100%;
  margin-bottom: 24px;
  height: auto;
  max-height: 330px;
  overflow-y: auto;
  padding-right: 6px;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #606060;
  }

  &::-webkit-scrollbar {
    height: 0;
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #c4c4c4;
  }
`;

export const InvitedText = styled.p`
  width: 100%;
  margin-bottom: 24px;
  color: #7a7a7a;
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 18px;
`;

export const IndividualUserBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
`;
export const NameContainer = styled.div`
  display: flex;
  align-items: center;

  p {
    font-weight: 600;
    font-size: 16px;
    margin-left: 14px;
    line-height: 16px;
    color: #ffffff;
  }
`;
export const RoleDeleteContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const DeleteBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  background: #0f0f0f;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 10px;
`;

export const BottomBox = styled.div`
  width: 100%;
  background: black !important;
  padding: 24px;
  border-radius: 0px 0px 6px 6px;
`;
export const UniversalBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CopyLinkBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const LinkFlex = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  button {
    padding: 8px 24px !important;

    &:last-child {
      background: black !important;
    }
  }
`;

export const CancelButton = styled.button`
  padding: 8px 24px;
  color: #ffffff;
  font-size: 15px;
  background: #474747;
  border-radius: 35px;
  border: none;
  margin-right: 24px;
  cursor: pointer;
`;

export const UniversalLinkButton = styled.button`
  display: flex;
  outline: none;
  background: #313131;
  color: #ccbbff;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;
export const LinkIconBox = styled.div`
  background: #0f0f0f;
  border-radius: 6px;
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const SendInviteButton = styled.div`
  background: black;

  padding: 8px 24px;

  position: relative;
  border-radius: 35px;
  background-clip: padding-box;

  p {
    color: white;
    margin: 0;
    position: relative;
  }

  border: 1px solid;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: ${(props) => (true ? '-2px' : '0')};
    border-radius: inherit; /* !importanté */
    background: linear-gradient(89.61deg, #ff9933 13.05%, #7427ff 90.81%);
  }
`;
