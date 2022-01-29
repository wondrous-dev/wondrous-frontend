import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { White } from '../../../theme/colors';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';

export const UserInfoDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const InviteDiv = styled.div`
  display: flex;
  margin-top: 20px;
`;
const ProfilePictureStyles = {
  marginRight: '16px',
  width: '32px',
  height: '32px',
  borderRadius: '16px',
};

export const UserProfilePicture = (props) => {
  return <SafeImage src={props?.src} style={ProfilePictureStyles} />;
};

export const DefaultProfilePicture = (props) => {
  return <DefaultUserImage style={ProfilePictureStyles} />;
};

export const UsernameText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
    font-height: 22px;
  }
`;

export const SeeMoreText = styled(Typography)`
  && {
    color: ${White};
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
  }
`;
