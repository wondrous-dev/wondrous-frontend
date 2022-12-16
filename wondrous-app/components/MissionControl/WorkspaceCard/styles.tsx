import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const WorkspaceCardBannerImage = styled.div`
  border-radius: 6px;
  position: relative;
  background: ${({ src }) => `url(${src})`};
  background-size: cover;
  background-position: center;
  width: 100%;
  transition: background 0.4s;
  img {
    visibility: hidden;
    height: 100%;
    width: 100%;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 6px;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
`;

export const WorkspaceCardStat = styled.button`
  display: flex;
  gap: 10px;
  cursor: pointer;
  background: ${palette.grey950};
  border-radius: 4px;
  border: 0;
  padding: 2px 4px;
  color: white;
  width: 100%;
  height: 40px;
  z-index: 10;
  align-items: center;
  &:hover {
    background: ${palette.grey87};
  }

  svg {
    flex-basis: 10%;
    height: 100%;
    .blackCircle {
      display: none;
    }
  }
`;

export const MissionControlWorkspaceCardWrapper = styled.div`
  width: fit-content;
  max-width: 49%;
  flex-grow: 1;
  background: ${palette.grey900};
  border-radius: 6px;
  height: fit-content;
  position: relative;
  transition: box-shadow 0.1s ease-in;
  &:hover {
    box-shadow: -8px 18px 25px 3px rgba(16, 16, 16, 0.5);
    background: ${palette.grey1000};
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 6px;
      background: ${({ gradient }) => gradient};
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
    }
    ${WorkspaceCardBannerImage} {
      background: ${({ hoverImg }) => `url(${hoverImg})`};
      background-size: cover;
      background-position: center;
      &::after {
        background: ${({ gradient }) => gradient};
      }
    }
  }

  ${({ theme }) => theme.breakpoints.down('md')} {
    max-width: 60%;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-width: 100%;
  }
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
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
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
  max-width: 400px;
  top: 16%;
`;
