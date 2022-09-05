import styled from 'styled-components';
import { LabelWrapper, OrgSearchButton } from 'components/OrgSearch/styles';
import palette from 'theme/palette';
import typography from 'theme/typography';
import Typography from '@mui/material/Typography';

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
