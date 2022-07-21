import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';
import PlusIcon from 'components/Icons/plus';
import Typography from '@mui/material/Typography';

export const AddTaskButton = styled.button`
  background: ${palette.grey900};
  border-radius: 6px;
  height: 50px;
  width: ${({ fullWidth }) => (fullWidth ? 'fit-content' : '100%')};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  border: 0;
  font-family: ${typography.fontFamily};
  font-style: normal;
  color: ${typography.body3.color};
  font-size: ${typography.body3.fontSize};
  line-height: ${typography.body3.lineHeight};
  font-weight: ${typography.body3.fontWeight};
  gap: 8px;
  cursor: pointer;
`;

export const EmptyStatePlaceholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, ${palette.black97} 0%, ${palette.black95} 100%);
  opacity: 0.6;
  border-radius: 6px;
  min-height: 300px;
`;

export const EmptyStateWrapper = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 1em;
  ${({ fullWidth }) => fullWidth && 'width: 100% !important; align-items: center;'};
`;

const PlusIconWrapper = styled.div`
  background: ${palette.black};
  border-radius: 114px;
  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(270deg, ${palette.blue20} -5.62%, ${palette.highlightPurple} 45.92%, #00baff 103.12%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
    border-radius: 180px;
  }
`;
export const AddTaskPlusIcon = () => (
  <PlusIconWrapper>
    <PlusIcon />
  </PlusIconWrapper>
);

export const NoPermissionToCreateWrapper = styled.div`
  background: ${palette.black101};
  border-radius: 6px;
  padding: 14px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const UserRoleInfoHighlight = styled(Typography)`
  && {
    color: ${typography.h1.color};
    width: 70%;
    font-family: ${typography.fontFamily};
    font-weight: ${typography.h1.fontWeight};
    span {
      text-transform: capitalize;
    }
  }
`;

export const UserRoleInfo = styled(UserRoleInfoHighlight)`
  && {
    font-weight: 400;
  }
`;
