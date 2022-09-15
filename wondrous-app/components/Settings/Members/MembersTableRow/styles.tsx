import { MenuItem, Select, Typography } from '@mui/material';
import styled from 'styled-components';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import typography from 'theme/typography';
import palette from 'theme/palette';

export const UserProfile = styled.a`
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
`;

const profilePictureStyles = {
  width: '40px',
  height: '40px',
  borderRadius: '1000px',
};

export function DefaultProfilePicture(props) {
  return <DefaultUserImage style={profilePictureStyles} />;
}

export const WalletAddressEmptyState = styled.div`
  padding: 8.5px 14.5px;
  border-radius: 6px;
  border: 1px solid ${palette.black101};
  background-color: ${palette.background.default};
  color: ${palette.grey57};
  font-family: ${typography.fontFamily};
  font-size: 15px;
  width: 150px;
  min-width: 150px;
`;

export const UserWalletAddressContainer = styled(WalletAddressEmptyState)`
  && {
    background: ${palette.black101};
    padding: 8.5px 8px;
    border-color: ${(props) => (props.hasAddressBeenCopied ? palette.green800 : 'transparent')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: border-color 0.2s ease-in-out;

    :hover {
      border: 1px solid ${palette.grey79};
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const UserWalletAddress = styled(Typography)`
  && {
    color: ${(props) => (props.hasAddressBeenCopied ? palette.green800 : palette.white)};
    font-family: ${typography.fontFamily};
    font-size: 15px;
    font-weight: ${(props) => (props.hasAddressBeenCopied ? 500 : 400)};
    transition: all 0.2s ease-in-out;
    max-width: 11ch;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const UserOptions = styled.div`
  background: ${palette.black101};
  padding: 9px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    display: flex;
    align-items: center;
  }
`;

const StyledSelect = styled(Select)`
  && {
    background: ${palette.black101};
    color: ${palette.white};
    height: 42px;
    width: 100%;
    border-radius: 6px;
    border: 1px solid transparent;
    transition: border 0.2s ease-out;

    :hover {
      border: 1px solid ${palette.grey79};
    }

    svg {
      color: ${palette.white};
      transition: transform 0.2s ease-out;
    }

    p {
      margin: 0;
    }
  }
`;

export const MemberRoleSelect = styled(({ className, ...props }) => (
  <StyledSelect {...props} {...className} MenuProps={{ classes: { paper: className } }} />
))`
  &.MuiPaper-root {
    background: ${palette.black101};
    border: 1px solid ${palette.grey79};
    width: 100%;
    max-width: 259px;
    color: ${palette.white};
    transform: translateX(18%) !important;
  }

  &.MuiPaper-root > .MuiList-root {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &.MuiPaper-root > .MuiList-padding {
    padding: 12px;
  }
`;

export const MemberRoleSelectValueDisplay = styled.div`
  display: flex;
  align-items: center;
`;

export const MemberRoleSelectMenuItem = styled(MenuItem)`
  && {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${palette.black98} !important;
    color: ${palette.white};
    border-radius: 4px;
    padding: 8px;
    transition: background 0.2s ease-out;
    position: relative;

    :hover {
      background: ${palette.black92} !important;
    }

    ::before {
      position: absolute;
      inset: 0;
      content: '';
      display: block;
      padding: 1px;
      background: ${(props) =>
        props.isSelected
          ? `linear-gradient(89.84deg, ${palette.highlightOrange} 5.89%, ${palette.highlightPurple} 90.32%)`
          : 'transparent'};
      mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      border-radius: 4px;
      width: 100%;
      height: 100%;
    }
  }
`;

export const MemberRoleSelectMenuIconWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  border-color: ${(props) => (props.isSelected ? palette.highlightPurple : palette.grey78)};
  border-radius: 1000px;
  padding: 1px;
`;

export const MemberRole = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-family: ${typography.fontFamily};
  font-size: 13px;
  font-weight: 500;
  color: ${palette.white};
  padding: 2px 7px;
  border: 1px solid ${(props) => (props.borderColor ? props.borderColor : palette.white)};
  border-radius: 1000px;
`;
