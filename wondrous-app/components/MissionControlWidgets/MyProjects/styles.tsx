import styled from 'styled-components';
import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import palette from 'theme/palette';
import typography from 'theme/typography';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export const MyProjectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${palette.grey900};
  border-radius: 6px;
  min-width: 30%;
  flex: 1;
  padding: 10px;
  width: 100%;
`;

export const BannerImage = styled.img`
  border-radius: 6px;
  height: 100%;
  width: 100%;
`;

export const ExploreCreateButton = styled(Button)`
  && {
    height: 43px;
    width: 50%;
    background: ${palette.black92};
    border-radius: 6px;
    font-size: 13px;
    color: ${palette.blue20};
    text-transform: none;
    align-items: stretched;
    gap: 10px;
    &:hover {
      background: ${palette.grey87};
    }
  }
`;

export const ExploreCreateButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px 0px;
`;

export const ProjectRowContainer = styled.div`
  border-radius: 6px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
  &:hover {
    background: ${palette.grey87};
  }
`;

export const MyProjectRowsContainer = styled.div`
  max-height: 200px;
  overflow: auto;
  z-index: 1;
  ${ScrollBarStyles};
`;

export const MyProjectBannerContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const MyProjectLabel = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 700;
    font-size: 30px;
    text-align: center;
    letter-spacing: 0.0025em;
    background: ${palette.white};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

export const OrgNameTitle = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: ${palette.white};
  }
`;
