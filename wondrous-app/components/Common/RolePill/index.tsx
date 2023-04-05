import React from 'react';

import { getRoleEmoji } from 'components/Settings/Members/MembersTableRow/helpers';
import { DefaultUserImage, SafeImage } from 'components/Common/Image';

import { MemberRolePill, ProfilePictureStyle, RolePillText } from './styles';

type RolePillProps = {
  roleName?: String;
  onClick?: React.MouseEventHandler<HTMLElement>;
  fontSize?: Number;
  profilePicture?: string;
  variation?: boolean;
};

const ProfilePicture = ({ variation, profilePicture }) => {
  if (variation) return null;
  return profilePicture ? (
    <SafeImage useNextImage={false} src={profilePicture} style={ProfilePictureStyle} alt="user profile picture" />
  ) : (
    <DefaultUserImage style={ProfilePictureStyle} />
  );
};

const RolePill = ({ roleName = 'no role', profilePicture, onClick, variation = false }: RolePillProps) => (
  <MemberRolePill onClick={onClick} roleName={roleName} variation={variation}>
    <ProfilePicture variation={variation} profilePicture={profilePicture} />
    <RolePillText variation={variation}>{`${getRoleEmoji(roleName)}  ${roleName}`}</RolePillText>
  </MemberRolePill>
);

export default RolePill;
