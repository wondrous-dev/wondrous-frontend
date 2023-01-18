import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import styled from 'styled-components';
import palette from 'theme/palette';
import { Button as ButtonComponent } from '../../Common/button';
import { LinkIcon } from '../../Icons/linkIcon';

export const OverviewComponent = styled.section`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  //background-color: ${palette.background.default};
  background-color: #0f0f0f;
  transition: 0.15s all ease;
  padding-bottom: 40px;
`;

export const HeaderImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  margin-top: 70px;
  overflow: hidden;
  position: relative;
`;

export const HeaderImageDefault = styled(() => (
  <Image
    src="/images/overview/background.png"
    fill
    style={{
      objectFit: 'cover',
    }}
    alt="header-image"
  />
))``;

export const TokenHeader = styled.div`
  position: relative;
  max-width: 680px;
  width: 100%;
  padding-top: 65px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

export const ContentContainer = styled.div`
  //max-width: 680px;
  max-width: 1037px;
  display: flex;
  //justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

export const HeaderMainBlock = styled.div`
  width: 100%;
  min-height: 40px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 28px;
    line-height: 36px;
    display: flex;
    align-items: center;
    color: #ffffff;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

export const HeaderButtons = styled.div`
  max-width: 295px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const HeaderEditProfileButton = styled(ButtonComponent)`
  && {
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    width: 159px;
    min-height: 39px;

    button {
      background: #0f0f0f;
      font-family: 'Space Grotesk';
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
    }
  }
`;

export const HeaderUserName = styled(Typography)`
  && {
    margin-top: 18px;
    font-family: 'Space Grotesk';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    color: #c4c4c4;
  }
`;

export const HeaderText = styled(Typography)`
  && {
    margin-top: 18px;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #ffffff;
    word-wrap: break-word;
  }
`;

export const HeaderActivity = styled.div`
  width: 100%;
  flex-wrap: wrap;
  display: flex;
  justify-content: left;
  align-items: center;
  margin-top: 18px;
`;

export const HeaderActivityLink = styled.a`
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ccbbff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-decoration-line: underline;
  margin-right: 12px;
`;

export const HeaderActivityLinkText = styled.span`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const HeaderActivitySocialIcon = styled(({ Component, ...props }) => <Component {...props} />)`
  width: 20px;
  height: 20px;
`;

export const HeaderActivityLinkIcon = styled(LinkIcon)`
  height: 23px;
  width: 23px;
  margin-right: 8px;
  margin-top: 8px;
`;

export const HeaderOrgPodCount = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 12px;
`;

export const HeaderPodCount = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 15px;
    line-height: 150%;
    display: flex;
    align-items: center;
    color: #ffffff;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    margin-right: 5px;
  }
`;

export const HeaderPodCountText = styled(HeaderPodCount)`
  && {
    color: #6c6c6c;
  }
`;

export const HeaderOrgCount = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 15px;
    line-height: 150%;
    display: flex;
    align-items: center;
    color: #ffffff;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    margin-right: 5px;
  }
`;

export const HeaderOrgCountText = styled(HeaderOrgCount)`
  && {
    color: #6c6c6c;
  }
`;

export const PostAuthor = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const PostAuthorPhoto = styled.img`
  position: absolute;
  left: -40px;
  width: 28px;
  height: 28px;
  margin-right: 10px;
`;

export const PostAuthorNickname = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: #ffffff;
  }
`;

export const PostAuthorText = styled(Typography)`
  && {
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
  }
`;

export const PostTask = styled.div`
  max-width: 625px;
  width: 100%;
  padding: 14px 14px 18px;

  border: 1px solid #4b4b4b;
  border-top-right-radius: 6px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

export const PostTaskHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
