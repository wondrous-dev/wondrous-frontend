import styled from 'styled-components';
import { OrgSearchButton } from 'components/OrgSearch/styles';
import palette from 'theme/palette';
import typography from 'theme/typography';
import Typography from '@mui/material/Typography';
import MuiBox from '@mui/material/Box';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';

export const Box = styled(MuiBox)`
  && {
    overflow: auto;
    max-height: 400px;
    margin-top: 18px;
    ${ScrollBarStyles};
  }
`;

export const ConfirmationStepWrapper = styled.div`
  ${OrgSearchButton} {
    background: ${palette.grey99};
  }
`;

export const Title = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    color: ${palette.white};
    font-size: 13px;
    font-weight: 500;
  }
`;

export const Description = styled(Title)`
  && {
    font-weight: 400;
  }
`;

export const SelectedMembersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const SelectedMembersItem = styled.div`
  margin-left: ${({ withRightMargin }) => (withRightMargin ? '-5px' : 0)};
`;

export const MembersDisplayAll = styled(SelectedMembersItem)`
  background: ${palette.highlightPurple};
  color: ${palette.white};
  padding: 7px 6px;
  border-radius: 160px;
  height: 24px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
`;

export const InputWrapper = styled.div`
  .MuiOutlinedInput-root {
    background: ${palette.black97};
    border-radius: 4px;
    color: ${palette.white};
  }
`;

export const RemoveButton = styled.button`
  background: ${palette.grey58};
  display: none;
  color: ${palette.white};
  border-radius: 6px;
  height: 36px;
  padding: 10px;
  align-items: center;
  font-family: ${typography.fontFamily};
  font-weight: 500;
  font-size: 14px;
  border: 0;
  cursor: pointer;
  &:hover {
    background: ${palette.grey78};
  }
`;

export const MembersItem = styled.div`
  display: flex;
  flex: 1 1 auto;
  gap: 12px;
  align-items: center;
  border-radius: 6px;
  padding: 10px;
  &:hover {
    background: ${palette.black92};
    ${RemoveButton} {
      display: flex;
    }
  }
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const MemberUsername = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-size: 15px;
    font-weight: 700;
    color: ${palette.blue20};
  }
`;
