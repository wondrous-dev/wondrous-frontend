import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import { SafeImage } from 'components/Common/Image';

export const VoteResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
  padding: 10px 10px 10px 10px;
  width: 100%;
  background: ${palette.grey910};
  border-radius: 6px;
  margin-top: 18px;
`;

export const VoterProfilePicture = styled(SafeImage).attrs({ useNextImage: false })`
  width: 15px;
  height: 15px;
  border-radius: 4px;
`;

export const VoteRowWrapper = styled.div`
  width: 100%;
  background: #282828;
  border-radius: 6px;
  cursor: pointer;
`;

export const VoteRowContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 5px 5px 5px;
  align-items: center;
  width: 100%;
  :hover {
    background: ${palette.black92};
  }
`;

export const VoteProgressBar = styled.div`
  background: ${palette.grey920};
  border-radius: 410px;
  width: 100%;
  height: 5px;
`;

export const VoteCurrentProgress = styled(VoteProgressBar)`
  && {
    width: ${({ width }) => width};
    background: ${({ color }) => color};
  }
`;

export const VoteLabel = styled(Typography)`
  && {
    color: ${({ color }) => color};
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: ${({ weight }) => weight};
    line-height: 15px;
  }
`;
