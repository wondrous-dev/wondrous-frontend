import GitHubIcon from '@mui/icons-material/GitHub';
import WalletModal from 'components/Common/Wallet/WalletModal';
import { RichTextViewer } from 'components/RichText';
import { GithubLink, GithubLinkText } from 'components/Settings/Github/styles';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import { useCallback, useReducer, useState } from 'react';

import EmptyState from 'components/EmptyStateGeneric';
import ErrorIcon from 'components/Icons/errorIcon.svg';
import MoreIcon from 'components/Icons/more';
import Tooltip from 'components/Tooltip';

import { useMutation } from '@apollo/client';
import { APPROVE_TASK_PROPOSAL, CLOSE_TASK_PROPOSAL } from 'graphql/mutations';
import { addTaskItem, getProposalStatus, updateProposalItem } from 'utils/board';
import { STATUS_APPROVED } from 'utils/constants';
import { transformTaskToTaskCard } from 'utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import {
  ActionButton,
  ConnectToWalletButton,
  GithubBlock,
  LockedTask,
  TaskDescriptionText,
  TaskDescriptionTextShowAllText,
  TaskModalHeaderMenu,
  TaskModalHeaderMenuButton,
  TaskModalHeaderMenuItem,
  TaskSectionDisplayDiv,
  TaskSectionDisplayLabel,
  TaskSectionDisplayLabelText,
  TaskSectionImageContentImage,
  TaskSectionImageContentSafeImage,
  TaskSectionImageContentWrapper,
  TaskSectionInfoPaymentAmount,
  TaskSectionInfoPaymentMethodChain,
  TaskSectionInfoPaymentMethodIcon,
  TaskSectionInfoPaymentWrapper,
  WalletError,
  WalletErrorText,
} from './styles';

export const TaskSectionImageContent = ({
  hasContent,
  DefaultContent = null,
  DefaultContentProps = null,
  imgSrc = '',
  DefaultImageComponent = null,
  ContentComponent,
  ContentComponentProps = null,
  onClick = () => {},
}) => {
  if (!hasContent) return <DefaultContent {...DefaultContentProps} />;

  const defaultImage = DefaultImageComponent && (
    <TaskSectionImageContentImage>
      <DefaultImageComponent />
    </TaskSectionImageContentImage>
  );

  const image = imgSrc ? (
    <TaskSectionImageContentImage>
      <TaskSectionImageContentSafeImage src={imgSrc} />
    </TaskSectionImageContentImage>
  ) : (
    defaultImage
  );

  return (
    <TaskSectionImageContentWrapper onClick={onClick}>
      {image}
      <ContentComponent {...ContentComponentProps} />
    </TaskSectionImageContentWrapper>
  );
};

export const GithubButtons = ({ fetchedTask }) => {
  const githubIssue = fetchedTask?.githubIssue;
  const githubPullRequest = fetchedTask?.githubPullRequest;

  if (githubIssue || githubPullRequest) {
    return (
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Github</TaskSectionLabel>
        <GithubBlock>
          {githubIssue && (
            <GithubLink href={githubIssue?.url} target="_blank">
              <GitHubIcon />
              <GithubLinkText>Github issue</GithubLinkText>
            </GithubLink>
          )}
          {githubPullRequest && (
            <GithubLink href={githubPullRequest?.url} target="_blank">
              <GitHubIcon />
              <GithubLinkText>{githubPullRequest?.title}</GithubLinkText>
            </GithubLink>
          )}
        </GithubBlock>
      </TaskSectionDisplayDiv>
    );
  }

  return null;
};

export const TaskDescriptionTextWrapper = ({ text, showFullByDefault = false }) => {
  const initialHeight = 100;
  const [showButton, setShowButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const checkRichTextHeight = useCallback((node) => {
    if (!node || showFullByDefault) return;
    const hasExceeded = node?.children?.[0]?.offsetHeight > initialHeight;
    setShowButton(hasExceeded);
    setIsExpanded(!hasExceeded);
  }, []);

  if (!text) return null;
  {
    /* <RichTextViewer text={grant.description} /> */
  }

  return (
    <>
      <TaskDescriptionText isExpanded={isExpanded} initialHeight={initialHeight} ref={checkRichTextHeight} as="div">
        <RichTextViewer text={text} />
      </TaskDescriptionText>
      {showButton && (
        <TaskDescriptionTextShowAllText onClick={handleExpand}>
          {isExpanded ? `Hide description` : `Show full description`}
        </TaskDescriptionTextShowAllText>
      )}
    </>
  );
};

export const TaskSectionLabel = ({ children }) => (
  <TaskSectionDisplayLabel>
    <TaskSectionDisplayLabelText>{children}</TaskSectionDisplayLabelText>
  </TaskSectionDisplayLabel>
);

export const ConnectToWallet = ({ user }) => {
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  if (user?.activeEthAddress) return null;

  return (
    <TaskSectionInfoPaymentWrapper>
      <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      <WalletError>
        <ErrorIcon />
        <WalletErrorText>Wallet not connected</WalletErrorText>
      </WalletError>
      <ConnectToWalletButton onClick={() => setWalletModalOpen(true)}>Connect</ConnectToWalletButton>
    </TaskSectionInfoPaymentWrapper>
  );
};

const TaskHeaderMenu = ({ canEdit, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!canEdit) return null;

  return (
    <>
      <Tooltip title="More actions" placement="top">
        <TaskModalHeaderMenuButton onClick={handleClick} open={open} data-cy="button-more-actions">
          <MoreIcon />
        </TaskModalHeaderMenuButton>
      </Tooltip>
      <TaskModalHeaderMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </TaskModalHeaderMenu>
    </>
  );
};

export const Menu = ({
  canArchive,
  canDelete,
  canEdit,
  isBounty,
  isMilestone,
  isTaskProposal,
  setArchiveTask,
  setCompleteModal,
  setDeleteTask,
  setEditTask,
  taskType,
}: any) => {
  const menuItems = {
    Complete: {
      condition: canEdit && (isMilestone || isBounty),
      onClick: setCompleteModal,
    },
    Edit: {
      condition: canEdit,
      onClick: setEditTask,
    },
    Archive: {
      condition: canArchive && !isTaskProposal,
      onClick: setArchiveTask,
    },
    Delete: {
      condition: canDelete,
      onClick: setDeleteTask,
      warning: true,
    },
  };
  return (
    <TaskHeaderMenu canEdit={canEdit}>
      {keys(menuItems).map((item) => {
        const { condition, onClick, ...props } = menuItems[item];

        return condition ? (
          <TaskModalHeaderMenuItem
            key={item}
            onClick={() => onClick(true)}
            data-cy={`task-header-option-${item}`}
            {...props}
          >
            {item} {taskType}
          </TaskModalHeaderMenuItem>
        ) : null;
      })}
    </TaskHeaderMenu>
  );
};

export const LockedTaskMessage = ({ handleClose, entityType = 'task' }) => (
  <LockedTask>
    <EmptyState content={`Oh! You don't have permission to view this ${entityType}`}>
      <ActionButton onClick={handleClose}>Visit board</ActionButton>
    </EmptyState>
  </LockedTask>
);

export const useManageProposals = ({ fetchedTask, entityType, handleClose }) => {
  const [approveTaskProposal] = useMutation(APPROVE_TASK_PROPOSAL);
  const [closeTaskProposal] = useMutation(CLOSE_TASK_PROPOSAL);
  const boardColumns = useColumns();

  const approveProposal = () => {
    approveTaskProposal({
      variables: {
        proposalId: fetchedTask?.id,
      },
      onCompleted: (data) => {
        const taskProposal = data?.approveTaskProposal;

        const fetchedTaskProposalStatus = getProposalStatus(fetchedTask);
        let columns = [...boardColumns?.columns];
        if (entityType) {
          const prevStatusIndex = columns.findIndex((column) => column.status === fetchedTaskProposalStatus);
          const approvedColumnIndex = columns.findIndex((column) => column.status === STATUS_APPROVED);
          columns[prevStatusIndex].tasks = columns[prevStatusIndex].tasks.filter((task) => task.id !== taskProposal.id);
          columns[approvedColumnIndex].tasks = [
            { ...taskProposal, approvedAt: new Date(), __typename: 'TaskProposalCard', isProposal: true },
            ...columns[approvedColumnIndex].tasks,
          ];
        } else {
          // keep it for userboard
          // Move from proposal to task
          columns = addTaskItem(
            transformTaskToTaskCard(
              {
                ...fetchedTask,
                id: taskProposal?.associatedTaskId,
                __typename: 'TaskCard',
                type: 'task',
                parentTaskId: null,
              },
              {}
            ),
            columns
          );
        }
        boardColumns?.setColumns(columns);
        document.body.setAttribute('style', `position: relative;`);
        handleClose();
      },
    });
  };

  const closeProposal = () => {
    closeTaskProposal({
      variables: {
        proposalId: fetchedTask?.id,
      },
      onCompleted: () => {
        let columns = [...boardColumns?.columns];
        // Move from proposal to task
        columns = updateProposalItem(
          {
            ...fetchedTask,
            changeRequestedAt: new Date(),
          },
          columns
        );
        boardColumns?.setColumns(columns);
      },
      refetchQueries: ['GetOrgTaskBoardProposals', 'getUserTaskBoardProposals'],
    });
    document.body.setAttribute('style', `position: relative;`);
    handleClose();
  };
  return {
    approveProposal,
    closeProposal,
  };
};
