import { Typography } from '@mui/material';
import styled from 'styled-components';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import typography from 'theme/typography';
import palette from 'theme/palette';

export const UserRowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 80px;
`;

export const UserProfile = styled.a`
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
`;

const ProfilePictureStyles = {
  width: '40px',
  height: '40px',
  borderRadius: '1000px',
};

export function DefaultProfilePicture(props) {
  return <DefaultUserImage style={ProfilePictureStyles} />;
}

export const UserProfileNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const UserProfileName = styled(Typography)`
  && {
    color: ${palette.white};
    font-family: ${typography.fontFamily};
    font-size: 15px;
    font-weight: 700;
  }
`;

export const UserProfileUsername = styled(Typography)`
  && {
    color: ${palette.grey250};
    font-family: ${typography.fontFamily};
    font-size: 12px;
    width: 18ch;
    max-width: 18ch;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const UserProfileDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
`;

export const WalletAddressEmptyState = styled.div`
  padding: 13.5px 14.5px;
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
    padding: 11.5px 8px;
    border-color: ${(props) => (props.hasAddressBeenCopied ? palette.green800 : 'transparent')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: border-color 0.2s ease-in-out;

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

export const UserPodCount = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  padding-right: 12px;
  border-radius: 6px;
  background: ${palette.black101};
  min-width: fit-content;

  color: ${palette.white};
  font-family: ${typography.fontFamily};
  font-size: 15px;
`;

export const UserPodIconContainer = styled.div`
  background: ${palette.background.default};
  padding: 7px 5.65px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserOptions = styled.div`
  background: ${palette.black101};
  padding: 13px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
