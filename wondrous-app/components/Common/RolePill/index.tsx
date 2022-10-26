import { getRoleEmoji } from 'components/Settings/Members/MembersTableRow/helpers';
import React from 'react';
import { MemberRolePill } from './styles';

interface RolePillType {
  roleName?: String;
  children?: any;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const RolePill: React.FC<RolePillType> = ({ roleName, onClick }) => (
  <MemberRolePill onClick={onClick} roleName={roleName}>{`${getRoleEmoji(roleName)}  ${
    roleName || 'no role'
  }`}</MemberRolePill>
);

export default RolePill;
