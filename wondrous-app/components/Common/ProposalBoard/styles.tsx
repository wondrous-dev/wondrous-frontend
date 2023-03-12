import styled from 'styled-components';
import palette from 'theme/palette';
import { Button, Typography, Tabs, InputBase } from '@mui/material';
import typography from 'theme/typography';
import { SafeImage } from '../Image';

export const ProposalBoardContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const RightSideContainer = styled.div`
  height: 100%;
  flex: 1;
`;

export const LeftSideContainer = styled.div`
  min-width: 280px;
  height: 100%;
  margin-right: 14px;
`;

export const LeftNewProposalContainer = styled.div`
  background: ${palette.grey900};
  padding: 14px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
`;

export const LeftSectionContainer = styled.div`
  background: ${palette.grey900};
  padding: 0;
  border-radius: 6px;
  margin-bottom: 14px;
`;

export const LeftSideText = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-size: 13px;
    margin-bottom: 14px;
    font-weight: 500;
  }
`;

export const LeftSideTab = styled.div`
  padding: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  &:hover {
    background: ${palette.grey87};
  }
`;

export const LeftSideTabText = styled(Typography)`
  && {
    color: ${palette.white};
    font-weight: 500;
    font-size: 13px;
    margin-left: 10px;
    text-transform: capitalize;
  }
`;

export const AddProposalButtonContainer = styled.div`
  background: ${palette.grey78};
  display: flex;
  justify-content: center;
  border-radius: 300px;
  padding: 8px 16px;
  align-items: center;
  cursor: pointer;
`;

export const AddProposalButtonContainerText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 13px;
    margin-left: 5px;
    font-weight: 500;
  }
`;

export const EmptyDiv = styled.div`
  background: ${palette.grey900};
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  border-radius: 6px;
  min-height: 57vh;
`;

export const EmptyDivText = styled(Typography)`
  && {
    font-size: 13px;
    color: ${palette.white};
  }
`;

export const ProposalItemCreatorSafeImg = styled(SafeImage)`
  && {
    width: 28px;
    height: 28px;
    radius: 14px;
    margin-left: 8px;
  }
`;

export const ProposalItemCreatorText = styled(Typography)`
  && {
    color: ${palette.grey600};
    font-family: ${typography.fontFamily};
    font-size: 15px;
    margin-left: 8px;
    font-weight: 600;
  }
`;

export const ProposalItemCreatedTimeago = styled(ProposalItemCreatorText)`
  && {
    color: ${palette.grey58};
    margin-left: 8px;
  }
`;

export const TotalVoteContainer = styled.div`
  && {
    background: ${palette.grey85};
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 64px;
  }
`;

export const TotalVoteNumber = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 600;
    margin-right: 4px;
  }
`;

export const VoteText = styled(TotalVoteNumber)`
  && {
    color: ${palette.white};
  }
`;

export const ProposalItemContainer = styled.div`
  background: ${palette.grey900};
  padding: 16px;
  margin-bottom: 24px;
  cursor: pointer;
`;

export const ProposalHeaderDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const ProposalCreatorLink = styled.a`
  color: ${palette.white};
`;

export const ProposalItemFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`;
