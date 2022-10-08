import styled from 'styled-components';
import { BountyCardWrapper } from 'components/Common/BountyBoard/styles';

import { TaskHeader } from 'components/Common/Task/styles';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { BoardsCardBody, BoardsCardBodyDescription, BoardsCardFooter } from 'components/Common/Boards/styles';

export const SubmissionCardWrapper = styled(BountyCardWrapper)``;

export const SubmissionIcon = styled.div`
  align-self: flex-end;
  flex: 1;
  margin-right: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  div {
    padding: 0;
    height: 100%;
    width: fit-content;
    svg {
      height: 29px;
      width: 29px;
    }
  }
`;

export const SubmissionCardHeader = styled(TaskHeader)`
  && {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 6px;
    border-bottom: 0.5px solid ${palette.grey75};
  }
`;

export const SubmissionIconWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

export const SubmissionType = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-size: 13px;
    line-height: 17px;
    color: ${palette.grey250};
  }
`;

export const SubmissionDescription = styled(BoardsCardBodyDescription)`
  && {
    color: ${palette.white};
  }
`;

export const SubmissionCardBody = styled(BoardsCardBody)`
  && {
    border-bottom: 0.5px solid ${palette.grey75};
    padding-bottom: 12px;
  }
`;

export const LinksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SubmissionCardFooter = styled(BoardsCardFooter)`
  && {
    justify-content: space-between;
    padding-bottom: 4px;
  }
`;

export const OrgButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
`;
