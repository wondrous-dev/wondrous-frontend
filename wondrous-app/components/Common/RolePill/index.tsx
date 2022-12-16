import { getRoleEmoji } from 'components/Settings/Members/MembersTableRow/helpers';
import React from 'react';
import { MemberRolePill } from './styles';

interface RolePillType {
  roleName?: String;
  children?: any;
  onClick?: React.MouseEventHandler<HTMLElement>;
  fontSize?: Number;
}

const RolePill: React.FC<RolePillType> = ({ roleName, onClick, ...props }) => (
  <MemberRolePill onClick={onClick} roleName={roleName} {...props}>{`${getRoleEmoji(roleName)}  ${
    roleName || 'no role'
  }`}</MemberRolePill>
);

export default RolePill;
