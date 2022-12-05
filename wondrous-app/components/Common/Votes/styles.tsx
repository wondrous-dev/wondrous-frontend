import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import { SafeImage } from 'components/Common/Image';

export const VoteResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 10px 10px 10px;
  width: 100%;
  background: ${palette.grey910};
  border-radius: 6px;
  margin-top: 18px;
`;

export const VoteButtonLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 100%;
    color: ${palette.white};
    ${({ isVoted, color }) =>
      isVoted &&
      `
  background: ${color};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`}
  }
`;

export const VoterProfilePicture = styled(SafeImage).attrs({ useNextImage: false })`
  width: 15px;
  height: 15px;
  border-radius: 4px;
`;

export const VoteButton = styled.button`
  padding: 8px 35px;
  border: 0;
  background: #0f0f0f;
  border-radius: 35px;
  cursor: pointer;
  min-width: 20%;
  display: flex;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 66px;
    background: ${({ color }) => color};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
  &:hover {
    background: ${({ hoverColor }) => hoverColor};
  }
  &:disabled {
    pointer-events: none;
  }
`;

export const VoteRowWrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
  background: #282828;
  border-radius: 6px;
`;

export const VoteRowContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 5px 5px 5px;
  align-items: center;
  width: 100%;
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

export const VoteRowResult = styled.span`
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 18px;
  color: #7a7a7a;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: fit-content;
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

export const RetractButton = styled.button`
  background: #313131;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 15px;
  border: 0;
  text-align: right;
  letter-spacing: 0.01em;
  border-radius: 6px;
  color: #ccbbff;
  margin-top: 10px;
  gap: 10px;
  cursor: pointer;
`;
