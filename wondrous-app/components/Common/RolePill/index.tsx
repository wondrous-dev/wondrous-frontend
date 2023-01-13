import { getRoleEmoji } from 'components/Settings/Members/MembersTableRow/helpers';
import React from 'react';
import { MemberRolePill, RolePillText } from './styles';

interface RolePillType {
  roleName?: String;
  children?: any;
  onClick?: React.MouseEventHandler<HTMLElement>;
  fontSize?: Number;
  borderColor?: String;
  backgroundColor?: String;
}

const RolePill: React.FC<RolePillType> = ({ roleName, onClick, ...props }) => (
  <MemberRolePill onClick={onClick} roleName={roleName} {...props}>
    <RolePillText {...props}>{`${getRoleEmoji(roleName)}  ${roleName || 'no role'}`}</RolePillText>
  </MemberRolePill>
);

export default RolePill;
