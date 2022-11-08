import { useState, useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import WalletModal from 'components/Common/Wallet/WalletModal';
import { RichTextViewer } from 'components/RichText';
import { GithubLink, GithubLinkText } from 'components/Settings/Github/styles';
import GitHubIcon from '@mui/icons-material/GitHub';

import ErrorIcon from 'components/Icons/errorIcon.svg';
import Tooltip from 'components/Tooltip';
import MoreIcon from 'components/Icons/more';
import EmptyState from 'components/EmptyStateGeneric';

import {
  ConnectToWalletButton,
  GithubBlock,
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
  LockedTask,
  ActionButton,
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

export const TaskDescriptionTextWrapper = ({ text }) => {
  const initialHeight = 100;
  const [showButton, setShowButton] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleExpand = () => setIsExpanded(!isExpanded);

  const checkRichTextHeight = useCallback((node) => {
    if (!node) return;
    const hasExceeded = node?.children?.[0]?.offsetHeight > initialHeight;
    setShowButton(hasExceeded);
    setIsExpanded(!hasExceeded);
  }, []);

  if (!text) return null;

  return (
    <>
      <TaskDescriptionText isExpanded={isExpanded} initialHeight={initialHeight} ref={checkRichTextHeight}>
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

export const Rewards = ({ fetchedTask, user, withLabel = true }) => {
  const rewards = fetchedTask?.rewards;
  if (isEmpty(rewards)) return null;
  return (
    <TaskSectionDisplayDiv>
      {withLabel ? <TaskSectionLabel>Rewards</TaskSectionLabel> : null}
      {rewards.map((reward, index) => {
        const { rewardAmount, symbol, icon, chain } = reward;
        return (
          <TaskSectionImageContent
            key={index}
            hasContent={reward}
            ContentComponent={() => (
              <TaskSectionInfoPaymentWrapper>
                <TaskSectionInfoPaymentMethodIcon src={icon} />
                <TaskSectionInfoPaymentAmount>
                  {rewardAmount} {symbol}
                </TaskSectionInfoPaymentAmount>
                <TaskSectionInfoPaymentMethodChain> On {chain}</TaskSectionInfoPaymentMethodChain>
                {user ? <ConnectToWallet user={user} /> : null}
              </TaskSectionInfoPaymentWrapper>
            )}
          />
        );
      })}
    </TaskSectionDisplayDiv>
  );
};

const TaskHeaderMenu = ({ canEdit, style, setAnchorElParent = undefined, anchorElParent = undefined, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElSelected = anchorElParent ?? anchorEl;
  const setAnchorElSelected = setAnchorElParent ?? setAnchorEl;
  const open = Boolean(anchorElSelected);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorElSelected(e.currentTarget);
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorElSelected(null);
  };

  if (!canEdit) return null;

  return (
    <>
      <Tooltip title="More actions" placement="top">
        <TaskModalHeaderMenuButton onClick={handleClick} open={open} data-cy="button-more-actions" style={style}>
          <MoreIcon />
        </TaskModalHeaderMenuButton>
      </Tooltip>
      <TaskModalHeaderMenu
        anchorEl={anchorElSelected}
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
  canArchive = false,
  canDelete = false,
  canEdit = false,
  isBounty = false,
  isMilestone = false,
  isTaskProposal = false,
  setArchiveTask,
  setCompleteModal,
  setDeleteTask = null,
  setEditTask,
  taskType,
  style = null,
  setAnchorElParent = null,
  anchorElParent = null,
}) => {
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
    <TaskHeaderMenu
      canEdit={canEdit}
      style={style}
      setAnchorElParent={setAnchorElParent}
      anchorElParent={anchorElParent}
    >
      {keys(menuItems).map((item) => {
        const { condition, onClick, ...props } = menuItems[item];

        return condition ? (
          <TaskModalHeaderMenuItem
            key={item}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClick(true);
              setAnchorElParent?.(null);
            }}
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

export const LockedTaskMessage = ({ handleClose }) => (
  <LockedTask>
    <EmptyState content={"Oh! You don't have permission to view this task"}>
      <ActionButton onClick={handleClose}>Visit board</ActionButton>
    </EmptyState>
  </LockedTask>
);
