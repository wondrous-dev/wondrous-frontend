import Typography from '@mui/material/Typography';
import { getRoleColor } from 'components/Settings/Members/MembersTableRow/helpers';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const ProfilePictureStyle = {
  width: '28px',
  height: '28px',
  borderRadius: '15px',
};
const variationMemberRolePill = css`
  background: transparent;
  padding: 8px;
  height: 28px;
`;

const variationRolePillText = css`
  padding: 0;
  background: transparent;
`;

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
  ${({ variation }) => variation && variationMemberRolePill}
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
    ${({ variation }) => variation && variationRolePillText}
  }
`;
