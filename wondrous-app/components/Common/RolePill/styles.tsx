import Typography from '@mui/material/Typography';
import { getRoleColor } from 'components/Settings/Members/MembersTableRow/helpers';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const MemberRolePill = styled.div`
  background: ${palette.grey900};
  display: flex;
  align-items: center;
  width: auto;
  padding: 2px 5px 2px 2px;
  gap: 6px;
  border-radius: 30px;
  height: 32px;
  border: 1px solid ${(props) => getRoleColor(props.roleName)};
  text-align: center;
  :hover {
    cursor: pointer;
  }
`;

export const RolePillText = styled(Typography)`
  && {
    border-radius: 500px;
    line-height: 1;
    padding: 4px;
    background: ${palette.grey85};
    max-lines: 1;
    white-space: nowrap;
    font-size: ${(props) => props.fontSize || '14px'};
    font-family: ${typography.fontFamily};
    color: white;
  }
`;
