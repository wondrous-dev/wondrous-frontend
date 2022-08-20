import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const MissionControlWorkspaceCardWrapper = styled.div`
  border: 1px solid black;
  width: 49%;
  flex-grow: 1;
  height: 500px;
  background: ${palette.grey900};
  border-radius: 6px;
`;

export const WorkspaceCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 10px;
  gap: 10px;
`;

export const WorkspaceCardBannerContainer = styled.div`
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const WorkspaceCardBannerImage = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 6px;
`;

export const WorkspaceCardBannerLabel = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 700;
    font-size: 36px;
    line-height: 36px;

    text-align: center;
    letter-spacing: 0.0025em;
    margin-bottom: 18%;
    background: ${({ gradient }) => gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export const WorkspaceCardStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const WorkspaceCardStat = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
  background: ${palette.grey950};
  border-radius: 4px;
  padding: 2px 4px;
  color: white;
  width: 100%;
  height: 40px;
  align-items: center;
  svg {
    flex-basis: 10%;
    height: 100%;
  }
`;

export const WorkspaceCardStatCount = styled(Typography)`
  && {
    background: ${({ gradient }) => gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    flex-basis: 5%;
    text-fill-color: transparent;
    font-family: ${typography.fontFamily};
    font-weight: 600;
    font-size: 15px;
  }
`;

export const WorkspaceCardStatLabel = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 600;
    font-size: 15px;
    color: ${palette.white};
  }
`;

export const WorkspaceCardLabelWrapper = styled.div`
  position: absolute;
  width: min-content;
`;
