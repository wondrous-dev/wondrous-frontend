import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import CommentList from 'components/Comment';
import { ActionButton } from 'components/Common/Task/styles';
import Divider from 'components/Divider';
import CopyIcon from 'components/Icons/copy';
import { DataDisplayWrapper } from 'components/ViewGrant/Fields/styles';
import { selectApplicationStatus } from 'components/ViewGrant/utils';
import {
  APPROVE_GRANT_APPLICATION,
  REJECT_GRANT_APPLICATION,
  REOPEN_GRANT_APPLICATION,
  REQUEST_CHANGE_GRANT_APPLICATION,
} from 'graphql/mutations';
import { useState } from 'react';
import { ENTITIES_TYPES, GRANT_APPLICATION_COMMENT_TYPE, GRANT_APPLICATION_STATUSES } from 'utils/constants';
import { Button, GrantApplicationStatusWrapper, WalletAddressWrapper } from './styles';


export const GrantApplicationStatusManager = ({ grantApplication }) => {
  const [commentType, setCommentType] = useState(null);
  
  const status = selectApplicationStatus(grantApplication);

  const [approveGrantApplication] = useMutation(APPROVE_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById'],
  });

  const [reopenGrantApplication] = useMutation(REOPEN_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById'],
  });

  const [requestChanges] = useMutation(REQUEST_CHANGE_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById'],
  });

  const [rejectGrantApplication] = useMutation(REJECT_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById'],
  });

  const GRANT_APPLICATION_COMMENT_ACTIONS = {
    [GRANT_APPLICATION_COMMENT_TYPE.CHANGE_REQUESTED]: () => requestChanges({ variables: { grantApplicationId: grantApplication.id } }).then(() => setCommentType(null)),
    [GRANT_APPLICATION_COMMENT_TYPE.REJECTED]: () => rejectGrantApplication({ variables: { grantApplicationId: grantApplication.id } }).then(() => setCommentType(null)),
  };

  console.log(status, 'status')
  const BUTTONS_CONFIG = [
    {
      label: status === GRANT_APPLICATION_STATUSES.APPROVED ? 'Undo Approval' : 'Approve',
      gradient: 'linear-gradient(259.59deg, #06FFA5 0%, #7427FF 93.38%)',
      commentType: null,
      disabled: commentType || [GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED, GRANT_APPLICATION_STATUSES.REJECTED].includes(status),
      isActive: status === GRANT_APPLICATION_STATUSES.APPROVED,
      action: () =>
        approveGrantApplication({
          variables: {
            grantApplicationId: grantApplication.id,
          },
        }),
    },
    {
      label: status === GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED ? 'Changes requested' : 'Request changes',
      gradient: 'linear-gradient(259.59deg, #FFD653 0%, #7427FF 93.38%)',
      commentType: GRANT_APPLICATION_COMMENT_TYPE.CHANGE_REQUESTED,
      isActive: status === GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED,
      disabled: (commentType && commentType !== GRANT_APPLICATION_COMMENT_TYPE.CHANGE_REQUESTED) || [GRANT_APPLICATION_STATUSES.APPROVED, GRANT_APPLICATION_STATUSES.REJECTED].includes(status),
      action: () => setCommentType(GRANT_APPLICATION_COMMENT_TYPE.CHANGE_REQUESTED),
    },
    {
      label: status === GRANT_APPLICATION_STATUSES.REJECTED ? 'Rejected' : 'Reject',
      gradient: 'linear-gradient(259.59deg, #F93701 0%, #7427FF 93.38%)',
      commentType: GRANT_APPLICATION_COMMENT_TYPE.REJECTED,
      isActive: status === GRANT_APPLICATION_STATUSES.REJECTED,
      disabled: (commentType && commentType !== GRANT_APPLICATION_COMMENT_TYPE.REJECTED) || [GRANT_APPLICATION_STATUSES.APPROVED, GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED].includes(status),
      action: () => setCommentType(GRANT_APPLICATION_COMMENT_TYPE.REJECTED),
    },
  ];
  
  return (
    <GrantApplicationStatusWrapper>
      <Grid display="flex" justifyContent="space-between" alignItems="center" gap="24px">
        {BUTTONS_CONFIG.map((buttonConfig, index) => (
          <Button
            key={index}
            onClick={buttonConfig.action}
            gradient={buttonConfig.gradient}
            disabled={buttonConfig.disabled}
            isActive={buttonConfig.isActive}
          >
            {buttonConfig.label}
          </Button>
        ))}
      </Grid>
      {!!commentType && <Divider />}
      {!!commentType && (
        <Grid width="100%">
          <CommentList
            // need to rename comment list submissions & tasks to something more generic
            task={grantApplication}
            type={commentType}
            entityType={ENTITIES_TYPES.GRANT_APPLICATION}
            onCommentCallback={GRANT_APPLICATION_COMMENT_ACTIONS[commentType]}
            showCommentBox
            showComments={false}
          />
        </Grid>
      )}
    </GrantApplicationStatusWrapper>
  );
};

export const WalletAddressViewer = ({ walletAddress }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleAddressCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(`${walletAddress}`);
  };

  return (
    <WalletAddressWrapper>
      <DataDisplayWrapper onClick={handleAddressCopy}>
        {isCopied ? 'Address copied!' : `${walletAddress?.slice(0, 12)}...${walletAddress?.slice(-4)}`}
        {!isCopied && <CopyIcon />}
      </DataDisplayWrapper>
    </WalletAddressWrapper>
  );
};
