import Typography from '@mui/material/Typography';
import { getRoleColor } from 'components/Settings/Members/MembersTableRow/helpers';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const MemberRolePill = styled.div`
  background: ${palette.grey85};
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 6px;
  border-radius: 30px;
  height: 32px;
  text-align: center;
  cursor: pointer;
  padding: 8px;
  height: 28px;

  :hover {
    background: ${palette.grey920};
  }
`;

export const RolePillText = styled(Typography)`
  && {
    border-radius: 500px;
    line-height: 1;
    padding: 4px;
    font-weight: 500;
    max-lines: 1;
    white-space: nowrap;
    font-size: ${(props) => props.fontSize || '14px'};
    font-family: ${typography.fontFamily};
    color: white;
  }
`;
