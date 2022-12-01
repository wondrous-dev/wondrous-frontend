import styled from 'styled-components';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import palette from 'theme/palette';

import ProposalIcon from 'components/Icons/proposalIcon';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import { BaseCard } from 'components/Common/card';
import { GradientMidnightDiagonal, GradientMidnightVertical } from 'components/Common/gradients';

export const TaskInner = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  flex-flow: column wrap;
  align-items: stretch;

  border-radius: 5px;
  padding: 4px;
  width: 100%;
  overflow: clip;

  ${GradientMidnightVertical}
`;

export const TaskWrapper = styled.div`
  display: flex;
  margin: ${(props) => (props.wrapped ? '0' : '1em 0 0 0')};

  padding: 1px;
  background: #515151;

  cursor: grab;

  ${GradientMidnightDiagonal}

  border-radius: ${(props) => (props.wrapped ? '0px' : '6px')};

  min-width: 290px;
  width: 100%;
  flex-wrap: wrap;
`;

export const TaskHeader = styled.div`
  display: flex;
  width: 100%;
  text-align: left;
  justify-content: space-between;
  align-items: center;
`;

export const TaskHeaderIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export const TaskContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-start;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.white};
  white-space: pre-line;
  cursor: pointer;
  overflow-x: hidden;
`;

export const TaskSeparator = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey80};
  margin-top: 5px;
`;

export const MilestoneProgressWrapper = styled.div`
  margin: 12px 0;
`;

export const TaskCardDescriptionText = styled.p`
  overflow: hidden;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 0;
`;

export const TaskTitle = styled.div`
  display: flex;
  color: white;
  font-size: 16px;
  font-weight: bold;

  a {
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const TaskFooter = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;
  z-index: 100;
  margin-top: 22px;

  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  height: 19px;
  line-height: 19px;
`;

export const TaskAction = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: space-between;
  align-items: center;
  cursor: pointer;
`;

export const TaskActionAmount = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  padding-left: 10px;
  color: ${({ theme }) => theme.palette.grey250};
`;

export const PodWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 6px;
  margin-top: 12px;
  background: ${palette.grey99};
  border-radius: 64px;
  padding: 2px 8px 2px 2px;
  max-width: fit-content;
  gap: 4px;
  height: max-content;
`;

export const BountySignifier = styled.div`
  && {
    background: ${palette.grey85};
    font-size: 13px;
    color: ${({ theme }) => theme.palette.white};
    padding: 1px 8px;
    border-radius: 190px;
    margin-left: -16px;
  }
`;

export const PodName = styled(Typography)`
  && {
    font-size: 13px;
    color: ${({ theme }) => theme.palette.white};
    border-radius: 190px;
    font-weight: 500;
  }
`;

export const SubtaskCountWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  justify-content: center;
`;

export const SubtaskCount = styled(Typography)`
  && {
    font-size: 13px;
    font-style: normal;
    color: #ffffff;
  }
`;

export const TaskModal = styled(Modal)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TaskModalBaseCard = styled(BaseCard)`
  width: 680px;
  position: absolute;
  left: 50%;
  top: 50%;
  height: 80%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(20, 20, 20) !important;
  border: 1px solid #424242;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  & > div {
    width: 100%;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 680px) {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transform: none;
  }
`;

const TaskModalHeaderWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const TaskModalHeaderWrapperRight = styled(TaskModalHeaderWrapper)`
  justify-content: flex-end;
`;

const TaskModalHeaderMenuItem = styled(MenuItem)`
  && {
    display: flex;
    justify-content: flex-start;
    color: ${({ theme }) => theme.palette.white};
    height: 32px;
    font-size: 13px;
    padding: 12px;
    :hover {
      background: ${({ theme }) => theme.palette.black98};
    }
  }
`;

export const TaskModalHeaderMenuItemRed = styled(TaskModalHeaderMenuItem)`
  && {
    color: ${({ theme }) => theme.palette.red800};
  }
`;

const TaskSectionDisplayText = styled(Typography)`
  && {
    font-size: 14px;
    border-radius: 4px;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.palette.blue20};
 `}
  }
`;

export const TaskSectionInfoText = styled(TaskSectionDisplayText)`
  && {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    ${({ theme }) => `
    color: ${theme.palette.white};
 `}
  }
`;

export const TaskSectionInfoDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskSubmissionTab = styled.div`
  flex: 1;
  margin-right: 16px;
  text-align: center;
  padding-bottom: 8px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  border-bottom: ${(props) => `2px solid ${props.isActive ? '#7427FF' : '#4B4B4B'}`};
`;

export const MakePaymentDiv = styled.div`
  background: #0f0f0f;
  border-radius: 184px;
  padding: 12px;
  display: flex;
  align-items: center;
`;

export const TaskSubmissionHeaderCreatorText = styled(Typography)`
  && {
    color: ${({ theme }) => theme.palette.white};
    font-size: 13px;
    line-height: 20px;
    font-weight: bold;
    margin-right: 8px;
  }
`;
export const TaskSubmissionHeaderTimeText = styled(Typography)`
  && {
    color: #828282;
    font-size: 13px;
    line-height: 20px;
  }
`;

export const TaskStatusHeaderText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
  }
`;

export const TaskLink = styled.a`
  && {
    color: #00baff;
    font-size: 14px;
    font-family: Space Grotesk;
  }
`;

export const TaskListModalHeader = styled(Typography)`
  && {
    font-size: 18px;
    line-height: 26px;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.palette.white};
  }
`;

export const TaskListModalContentWrapper = styled.div`
  padding-bottom: 30px;
`;

export const TaskListCardWrapper = styled.div`
  background: #0f0f0f;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
`;

export const ArchivedTaskUndo = styled.span`
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`;

export const ActionButton = styled(CreateFormPreviewButton)`
  && {
    padding: 4px 16px;
    margin-left: 0;
    margin-right: 12px;
    display: flex;
    justify-content: space-between;
    gap: 4px;
    height: auto;
    z-index: 10;
    border: 0px solid transparent;
    :hover {
      background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    }
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
      border-radius: 180px;
    }
  }
  &.Mui-disabled {
    &::before {
      background: transparent;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex: 1;
    width: 100%;

    && {
      height: 42px;
      justify-content: center;
    }
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.palette.white};
  padding: 14px;
  border-radius: 6px;
  background: ${palette.grey900};
  gap: 14px;
  border-radius: 6px;
  position: relative;
  height: fit-content;
  align-items: flex-start;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
    pointer-events: none;
  }
`;

export const ProposalCardType = styled.div`
  color: ${({ theme }) => theme.palette.blue20};
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 17px;
`;

export const ProposalIconBackground = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  padding: 5px;
  border-radius: 180px;
`;

const IconWrapper = styled.div`
  border-radius: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: linear-gradient(196.76deg, #474747 -48.71%, #181818 90.48%);
`;
export function ProposalCardIcon() {
  return (
    <ProposalIconBackground>
      <IconWrapper>
        <ProposalIcon />
      </IconWrapper>
    </ProposalIconBackground>
  );
}

export const ProposalFooterButton = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7px 16px;
  position: relative;
  border-radius: 180px;
  ${({ isAction, borderColor, color }) => {
    if (isAction) {
      return `
      cursor: pointer;
      z-index: 100;
      background:#363636;
      `;
    }
    return `border: 1px solid ${borderColor || 'transparent'};
    color: ${({ theme }) => color || theme.palette.white};
     ${
       !borderColor &&
       `&::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1px;
          border-radius: 180px;
      }`
     }`;
  }};
`;

export const DueDateText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    color: #c4c4c4;
    font-size: 13px;
    margin-right: 4px;
  }
`;

export const LoadMore = styled.div`
  height: 10px;
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;

export const TaskActionMenu = styled.div`
  display: flex;
  justify-content: center;
  height: 28px;
  width: max-content;
  z-index: 100;
  align-items: center;
  display: none;
  ${CardContent}:hover & {
    display: block;
  }
`;
