import { Button, IconButton, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { LogoSquare } from '../../Common/ci';

export const AboutSection = styled.div`
  max-width: 1038px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

export const AboutInfoTable = styled.div`
  max-width: 680px;
  width: 680px;
  margin: 20px auto 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const AboutInfoTableRow = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  margin-top: 16px;
  :first-child {
    margin-top: 0;
  }
`;

export const AboutInfoTableRowNameBlock = styled.div`
  max-width: 76px;
  width: 100%;
  height: 100%;
  display: flex;
`;

export const AboutInfoTableRowTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
`;

export const AboutInfoTableRowTitleText = styled(Typography)`
  && {
    margin-left: 10px;
    font-size: 14px;
    color: #c4c4c4;
  }
`;

export const AboutInfoTableRowContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 76px;
`;

export const AboutInfoTableRowContentItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 7px;
  background: #1c1c1c;
  border-radius: 4px;
  margin-right: 9px;
`;

export const AboutInfoTableRowContentItemText = styled(Typography)`
  && {
    font-size: 14px;
    text-align: center;
    color: #fff;
  }
`;

export const AboutInfoTableRowContentItemHashtag = styled(AboutInfoTableRowContentItemText)`
  && {
    color: #ccbbff;
  }
`;

export const AboutInfoTableRowContentItemLink = styled(AboutInfoTableRowContentItemText)`
  && {
    color: #ccbbff;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const AboutInfoTableRowContentIconBtn = styled(IconButton)`
  && {
    padding: 0;
    margin-left: 10px;
  }
`;

export const AboutInfoTableRowContentItemOpen = styled(AboutInfoTableRowContentItem)`
  background: #06ffa5;
  border-radius: 4px;
`;

export const AboutInfoTableRowContentSocialButton = styled(IconButton)`
  && {
    width: 32px;
    height: 32px;
    background: #1c1c1c;
    margin-right: 8px;
    padding: 0;
    border-radius: 2px;
  }
`;

export const AboutInfoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: left;
`;

export const AboutInfoBlock = styled.div`
  & {
    max-width: 325px;
    width: 100%;
    border-radius: 6px;
    background: linear-gradient(169.47deg, #4b4b4b 7.84%, #232323 108.71%);
    z-index: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 18px 14px;
    margin-left: 30px;
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

export const AboutInfoBlockHeader = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

export const AboutInfoBlockHeaderAmount = styled(Typography)`
  && {
    color: #ccbbff;
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    margin-right: 5px;
  }
`;

export const AboutInfoBlockHeaderText = styled(AboutInfoBlockHeaderAmount)`
  && {
    color: #fff;
  }
`;

export const AboutInfoBlockHeaderSeeAll = styled(AboutInfoBlockHeaderAmount)`
  && {
    position: absolute;
    right: 10px;
    font-size: 15px;
    line-height: 19px;
    cursor: pointer;
  }
`;

export const AboutInfoBlockContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

//about organisations card
export const OrganisationsCard = styled.div`
  margin-top: 10px;
  width: 100%;
  background: #0f0f0f;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

export const OrganisationsCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const OrganisationsCardHeaderWonderIcon = styled(LogoSquare)`
  width: 40px;
  height: 40px;
`;

export const OrganisationsCardHeaderName = styled(Typography)`
  && {
    padding-left: 10px;
    width: 100%;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    color: #ffffff;
  }
`;

export const OrganisationsCardContent = styled(Typography)`
  && {
    font-size: 13px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #828282;
    margin: 6px 0 12px;
  }
`;

export const OrganisationsCardAuthor = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

export const OrganisationsCardAuthorAvatar = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

export const OrganisationsCardAuthorPosition = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    color: #ffffff;
  }
`;

export const OrganisationsCardNoLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  max-height: 40px;
  width: 40px;
`;

//about pods card

export const PodsCardName = styled(Typography)`
  && {
    margin-top: 10px;
    width: 100%;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
  }
`;

export const PodsCardFooter = styled.div`
  max-width: 190px;
  width: 100%;
  min-height: 30px;
  height: 30px;
  display: flex;
  justify-content: space-between;
`;

export const PodsCardFooterIcon = styled(LogoSquare)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

export const PodsCardFooterButton = styled(Button)`
  && {
    padding: 6px 10px;
    background: linear-gradient(0deg, rgba(196, 196, 196, 0.07), rgba(196, 196, 196, 0.07)), #0f0f0f;
    border-radius: 4px;

    //text
    font-size: 13px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #ffffff;
  }
`;

//completedTasks card
export const CompletedCardTitle = styled(PodsCardName)`
  && {
    margin-top: 28px;
  }
`;

export const CompletedCardText = styled(OrganisationsCardContent)`
  font-size: 14px;
  line-height: 19px;
  color: #c4c4c4;
  margin: 10px 0 15px;
`;

export const CompletedCardFooter = styled.div`
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: space-between;
`;

export const CompletedCardFooterActivity = styled.div`
  max-width: 185px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CompletedCardFooterBlock = styled.div`
  max-width: 45px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CompletedCardFooterActivityIconBtn = styled(IconButton)`
  && {
    padding: 0;
  }
`;

export const CompletedCardFooterActivityAmount = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    color: #ffffff;
  }
`;
