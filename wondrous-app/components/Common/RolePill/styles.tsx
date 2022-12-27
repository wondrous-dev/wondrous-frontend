import { Typography } from '@mui/material';
import { getRoleColor } from 'components/Settings/Members/MembersTableRow/helpers';
import styled from 'styled-components';
import typography from 'theme/typography';

export const MemberRolePill = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  padding: 4px 12px 4px 12px;
  border-radius: 30px;
  border: 1px solid ${(props) => getRoleColor(props.roleName)};
  text-align: center;
  :hover {
    cursor: pointer;
  }
`;

export const RolePillText = styled(Typography)`
  && {
    max-lines: 1;
    white-space: nowrap;
    font-size: ${(props) => props.fontSize || '14px'};
    font-family: ${typography.fontFamily};
    color: white;
  }
`;
