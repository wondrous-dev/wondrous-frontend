import { getRoleEmojiByName } from 'components/Settings/Members/MembersTableRow/helpers';
import React, { ReactNode } from 'react';
import { MemberRolePill } from './styles';

interface RolePillType {
  roleName?: String;
  children?: any;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const RolePill: React.FC<RolePillType> = ({ roleName, onClick }) => (
  <MemberRolePill onClick={onClick} roleName={roleName}>{`${getRoleEmojiByName(
    roleName
  )}  ${roleName}`}</MemberRolePill>
);

export default RolePill;
