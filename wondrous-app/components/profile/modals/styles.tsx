import { Typography, Tab, Tabs } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import { EXPLORE_MODAL_TABS_MAP, MODAL_TABS_MAP } from 'utils/constants';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';

export const ActivityIndicatorContainer = styled.div`
  width: 100%;
  text-align: center;
`;

export const PodWrapper = styled.div`
  background: #0f0f0f;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
`;
export const UserMetaDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const NameText = styled(Typography)`
  && {
    color: #ccbbff;
    font-size: 15px;
    line-height: 20px;
    font-weight: 700;
    margin-right: 8px;
    margin-bottom: 4px;
  }
`;
export const CommentLine = styled(Typography)`
  && {
    font-size: 14px;
    line-height: 20px;
    color: #c4c4c4;
    font-weight: 600;
    text-align: left;
    white-space: pre-line;
  }
`;
const ProfilePictureStyles = {
  width: '52px',
  height: '52px',
  borderRadius: '52px',
  marginRight: '12px',
};

export const TabContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
  border-bottom: 2px solid #252525;
`;

export const PodExplainerText = styled(Typography)`
  && {
    color: #828282;
    font-size: 13px;
    line-height: 20px;
    margin-top: 8px;
  }
`;
export const TabContainerText = styled(Typography)`
  && {
    font-size: 16px;
    line-height: 19px;
    color: ${palette.white};
    font-weight: bolder;
  }
`;
export const Tab2 = styled.div`
  text-align: center;
  border-bottom: 2px solid ${(props) => (props.selected ? '#7427FF' : 'transparent')};
  padding-bottom: 12px;
  margin-right: 24px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
`;
export function UserProfilePicture(props) {
  return <SafeImage src={props?.src} style={ProfilePictureStyles} useNextImage={false} />;
}

export function DefaultProfilePicture(props) {
  return <DefaultUserImage style={ProfilePictureStyles} />;
}

export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  img {
    cursor: pointer;
  }
`;
export const OverflowBox = styled.div`
  height: 100%;
  overflow-y: auto;
  padding-right: 5px;
  scroll-snap-type: y mandatory;
  -ms-overflow-style: none;
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #606060;
  }

  &::-webkit-scrollbar {
    height: 0px;
    width: 5px;
    border-radius: 210px;
    background: #606060;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #c4c4c4;
  }
`;
export const SearchBox = styled.div`
  width: 100%;
  margin: 18px 0 20px;
  background: #141414;
  border-radius: 4px;
  padding: 13px;
  display: flex;
  align-items: center;
  img {
    width: 18px;
    margin-right: 13px;
  }
  input {
    background: none;
    border: none;
    outline: none;
    color: #7a7a7a;
    padding-left: 20px;
    flex: auto;
    &::placeholder {
      color: #7a7a7a;
      font-weight: 400;
      font-size: 14px;
      line-height: 19px;
    }
  }
`;
export const Title = styled(Typography)`
  && {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: ${palette.white};
  }
`;

export const Container = styled.div`
  width: 100%;
  margin-bottom: 0 !important;
  .MuiTabs-root {
    padding: 0 !important;
    margin: 0 !important;
  }
`;

export const StyledTabs = styled(Tabs)`
  && {
    color: #fff;
    ${({ withMargin = true }) => withMargin && 'margin: 30px auto;'};
    margin-top: 16px;
    width: 100%;
  }

  .MuiTabs-flexContainer {
    justify-content: start;
    ${({ withBorder = true }) => withBorder && 'border-bottom: 2px solid #4b4b4b;'};
  }
  .MuiTab-textColorInherit {
    color: unset;
  }
  .MuiButtonBase-root {
    padding: 0 5px;
    min-height: unset;
  }

  .MuiTabs-indicator {
    background: linear-gradient(270deg, #ccbbff 2.13%, #7427ff 48.52%, #00baff 100%);
    left: ${(props) => (props.value === MODAL_TABS_MAP.PODS ? '115px !important' : '0')};
    width: ${(props) => (props.value === MODAL_TABS_MAP.PODS ? '47.4792px !important' : '98px !important')};
    /* 39.4792px */
  }
`;

export const ExploreStyledTabs = styled(Tabs)`
  && {
    color: #fff;
    ${({ withMargin = true }) => withMargin && 'margin: 30px auto;'};
    margin-top: 16px;
    width: 100%;
  }

  .MuiTabs-flexContainer {
    justify-content: start;
    ${({ withBorder = true }) => withBorder && 'border-bottom: 2px solid #4b4b4b;'};
  }
  .MuiTab-textColorInherit {
    color: unset;
  }
  .MuiButtonBase-root {
    padding: 0 5px;
    min-height: unset;
  }

  .MuiTabs-indicator {
    background: linear-gradient(270deg, #ccbbff 2.13%, #7427ff 48.52%, #00baff 100%);
    left: ${(props) => (props.value === EXPLORE_MODAL_TABS_MAP.GRANTEES ? '95px !important' : '0')};
    width: ${(props) => (props.value === EXPLORE_MODAL_TABS_MAP.GRANTEES ? '70px !important' : '80px !important')};
    /* 39.4792px */
  }
`;

export const StyledTab = styled(Tab)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 500;
    min-width: fit-content;
    opacity: 1;
    margin-right: 20px;
    color: ${({ isActive }) => (isActive ? 'white' : '#828282')};
  }
`;

export const Snap = styled.div`
  // scroll-snap-align: start;
`;
export const TabText = styled.p`
  margin: 0px !important;
  height: 45px !important ;
  margin-bottom: 0;
  button {
    display: flex !important;
    height: 100% !important;
  }
`;

export const SearchIconContainer = styled.div`
  transform: translateY(2px);
  svg {
    path {
      stroke: #ccbbff;
    }
  }
`;

export const CloseIconContainer = styled.div`
  width: 32px;
  height: 32px;
  cursor: pointer;
  background: black;
  display: flex;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
`;
