import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import styled from 'styled-components';
import { LogoSquare } from 'components/Common/ci';
import { ModalCloseButton } from 'components/Common/ModalCloseButton';
import Task from 'components/Common/Task';
import { TaskInner, TaskWrapper } from 'components/Common/Task/styles';
import PodIcon from 'components/Icons/podIcon';

export const UserAboutInfoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
`;

export const UserAboutInfoBlock = styled.div`
  & {
    min-width: 325px;
    width: 100%;
    border-radius: 6px;
    background: linear-gradient(169.47deg, #4b4b4b 7.84%, #232323 108.71%);
    z-index: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 18px 14px;
    margin-left: 24px;
    height: max-content;
  }

  &:first-child {
    margin-left: 0;
  }

  & > * {
    z-index: 1;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: 0.05em;
    z-index: -1;
    border-radius: inherit;
    background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  }
`;

export const UserAboutInfoBlockHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
`;

export const UserAboutInfoBlockHeaderCountText = styled.div`
  display: flex;
  font-size: 15px;
  flex-basis: 70%;
`;

export const UserAboutInfoBlockHeaderCount = styled(Typography)`
  && {
    color: #ccbbff;
    font-weight: bold;
    padding-right: 4px;
  }
`;

export const UserAboutInfoBlockHeaderText = styled(Typography)`
  && {
    color: #fff;
    font-weight: normal;
  }
`;

export const UserAboutInfoBlockHeaderSeeAll = styled.div`
  display: flex;
  flex-basis: 30%;
`;

export const UserAboutInfoBlockHeaderSeeAllText = styled(Typography)`
  && {
    font-size: 15px;
    cursor: pointer;
    text-decoration: underline;
    color: #ccbbff;
    font-weight: 700;
    text-align: right;
    width: 100%;
  }
`;

export const UserAboutInfoBlockContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  align-content: flex-start;
`;

export const UserAboutInfoCard = styled.div`
  margin-top: 10px;
  width: 100%;
  background: #0f0f0f;
  cursor: pointer;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  :first-child {
    margin-top: 0;
  }
`;

export const UserAboutInfoCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export function UserAboutInfoCardHeaderPodIcon(props) {
  return <PodIcon {...props} style={{ width: '24px', height: '24px' }} />;
}

export const UserAboutInfoCardHeaderName = styled(Typography)`
  && {
    padding-left: 10px;
    width: 100%;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    color: #ffffff;
  }
`;

export const UserAboutInfoCardContent = styled(Typography)`
  && {
    font-size: 13px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #828282;
    margin: 6px 0 12px;
  }
`;

export const UserAboutInfoCardNoLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  max-height: 40px;
  width: 40px;
`;

// about pods card

export const UserAboutInfoPodsCardName = styled(Typography)`
  && {
    margin-top: 10px;
    width: 100%;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
  }
`;

export const UserAboutInfoPodsCardFooter = styled.div`
  width: 100%;
  max-height: 30px;
  display: flex;
  align-items: center;
`;

export const UserAboutInfoPodsCardFooterCount = styled(Typography)`
  && {
    background: linear-gradient(0deg, rgba(196, 196, 196, 0.07), rgba(196, 196, 196, 0.07)), #0f0f0f;
    border-radius: 4px;
    font-size: 13px;
    padding: 6px 10px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }
`;

export const UserAboutInfoSeeAllDialog = styled(Dialog)`
  && .MuiPaper-root {
    background-color: transparent;
    ::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
  }
`;

export const UserAboutInfoSeeAllDialogContentBorder = styled.div`
  background: linear-gradient(169.47deg, #4b4b4b 7.84%, #232323 108.71%);
  padding: 2px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserAboutInfoSeeAllDialogContent = styled(Box)`
  border-radius: 6px;
  width: 500px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  padding: 20px 20px;
`;

export const UserAboutInfoSeeAllDialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 15px;
  margin-bottom: 10px;
`;

export const UserAboutInfoSeeAllTextWrapper = styled.div`
  display: flex;
`;

export const UserAboutInfoSeeAllDialogCloseButton = styled(ModalCloseButton)``;

export const UserAboutInfoCompletedTasks = styled(Task)`
  margin-top: 10px;
  :first-child {
    margin-top: 0;
  }
  ${TaskWrapper} {
    margin-top: 0;
  }
  ${TaskInner} {
    background: #0f0f0f;
  }
`;
