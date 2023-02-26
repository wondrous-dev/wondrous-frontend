import { getRoleEmoji } from 'components/Settings/Members/MembersTableRow/helpers';
import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import React from 'react';

import { MemberRolePill, RolePillText } from './styles';

interface RolePillType {
  roleName?: String;
  children?: any;
  onClick?: React.MouseEventHandler<HTMLElement>;
  fontSize?: Number;
  profilePicture?: string;
}

const ProfilePictureStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '15px',
};

const RolePill: React.FC<RolePillType> = ({ roleName, profilePicture, onClick, ...props }) => (
  <MemberRolePill onClick={onClick} roleName={roleName} {...props}>
    {profilePicture ? (
      <SafeImage useNextImage={false} src={profilePicture} style={ProfilePictureStyle} alt="user profile picture" />
    ) : (
      <DefaultUserImage style={ProfilePictureStyle} />
    )}
    <RolePillText {...props}>{`${getRoleEmoji(roleName)}  ${roleName || 'no role'}`}</RolePillText>
  </MemberRolePill>
);

export default RolePill;
