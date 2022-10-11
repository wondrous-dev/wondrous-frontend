import { Typography } from '@mui/material';
import ChangesRequestedIcon from 'components/Icons/changesRequestedIcon.svg';
import styled from 'styled-components';
import palette from 'theme/palette';

export const SubmissionItemStatusWrapper = styled.div`
  background: #2f2f2f;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 50px;
  height: 28px;
  padding: 2px 12px 2px 3px;
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const SubmissionItemStatusChangesRequestedIcon = styled((props) => (
  <div {...props}>
    <ChangesRequestedIcon />
  </div>
))`
  background: ${palette.background.default};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
`;

const SubmissionItemStatusText = styled(Typography)`
  && {
    font-size: 14px;
    ${({ theme }) => `
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightMedium};
    `}
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const SubmissionItemStatusTextAwaitingReview = styled(SubmissionItemStatusText)`
  background: -webkit-linear-gradient(${palette.white}, ${palette.highlightBlue});
`;

export const SubmissionItemStatusTextChangesRequested = styled(SubmissionItemStatusText)`
  background: -webkit-linear-gradient(${palette.white}, ${palette.yellow800});
`;

export const SubmissionItemStatusTextChangesRejected = styled(SubmissionItemStatusText)`
  background: -webkit-linear-gradient(${palette.white}, ${palette.red400});
`;

export const SubmissionItemStatusTextCompleted = styled(SubmissionItemStatusText)`
  background: -webkit-linear-gradient(${palette.white}, ${palette.green30});
`;
