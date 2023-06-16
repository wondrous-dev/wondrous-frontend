import React from 'react';

import { getRoleEmoji } from 'components/Settings/Members/MembersTableRow/helpers';
import { DefaultUserImage, SafeImage } from 'components/Common/Image';

import { MemberRolePill, ProfilePictureStyle, RolePillText } from './styles';

type RolePillProps = {
  roleName?: String;
  onClick?: React.MouseEventHandler<HTMLElement>;
  fontSize?: Number;
  profilePicture?: string;
};

const RolePill: React.FC<RolePillProps> = ({ roleName, profilePicture, onClick, ...props }) => (
  <MemberRolePill onClick={onClick} roleName={roleName} {...props}>
    <RolePillText {...props}>{`${getRoleEmoji(roleName)}  ${roleName || 'no role'}`}</RolePillText>
  </MemberRolePill>
);

export default RolePill;
