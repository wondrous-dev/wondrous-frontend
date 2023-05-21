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

const RolePill: React.FC<RolePillType> = ({ roleName, profilePicture, onClick, ...props }) => (
  <MemberRolePill onClick={onClick} roleName={roleName} {...props}>
    <RolePillText {...props}>{`${getRoleEmoji(roleName)}  ${roleName || 'no role'}`}</RolePillText>
  </MemberRolePill>
);

export default RolePill;
