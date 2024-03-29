import { useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { OrgComponent } from 'components/BreadCrumbs/Components/OrgSelector';
import CommentList from 'components/Comment';
import MakePaymentModal from 'components/Common/Payment/PaymentModal';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import SubmittableCommentType from 'components/Common/SubmittableCommentType';
import { TaskMintWrapper } from 'components/Common/TaskMint/TaskMintButton/styles';
import Divider from 'components/Divider';
import CopyIcon from 'components/Icons/copy';
import PodIcon from 'components/Icons/podIcon';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { DataDisplayWrapper } from 'components/ViewGrant/Fields/styles';
import { selectApplicationStatus } from 'components/ViewGrant/utils';
import { UnstyledLink } from 'components/WorkspacePicker/styles';
import { useGlobalContext } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import {
  APPROVE_GRANT_APPLICATION,
  REJECT_GRANT_APPLICATION,
  REOPEN_GRANT_APPLICATION,
  REQUEST_CHANGE_GRANT_APPLICATION,
  CREATE_GRANT_APPLICATION_POD,
} from 'graphql/mutations';
import { useRouter } from 'next/router';
import { useWonderWeb3 } from 'services/web3';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { renderMentionString } from 'utils/common';
import {
  ENTITIES_TYPES,
  GRANT_APPLICATION_COMMENT_TYPE,
  GRANT_APPLICATION_STATUSES,
  PERMISSIONS,
  PAYMENT_STATUS,
} from 'utils/constants';
import { Button, GrantApplicationStatusWrapper, WalletAddressWrapper, CreateWorkspaceWrapper } from './styles';

const NOTES_LABEL = {
  [GRANT_APPLICATION_STATUSES.REJECTED]: 'Rejection Notes',
  [GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED]: 'Requested changes notes',
};

export const RenderNote = ({ comments, statusToFilter }) => {
  const router = useRouter();

  const note = useMemo(
    () => comments?.find((comment) => comment.additionalData.type === statusToFilter),
    [comments, statusToFilter]
  );
  return (
    <Grid display="flex" gap="8px" flexDirection="column">
      <SubmittableCommentType status={statusToFilter} text={NOTES_LABEL[statusToFilter]} />
      <Typography
        sx={{ maxWidth: 'fit-content' }}
        fontFamily={typography.fontFamily}
        color={palette.grey250}
        fontWeight={500}
        fontSize="15px"
      >
        {renderMentionString({
          content: note?.content,
          router,
        })}
      </Typography>
    </Grid>
  );
};

export const GrantApplicationStatusManager = ({ grantApplication }) => {
  const [commentType, setCommentType] = useState(null);

  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const status = useMemo(() => selectApplicationStatus(grantApplication), [grantApplication]);

  const onUpdateSuccess = (message) => {
    setSnackbarAlertMessage(message);
    setSnackbarAlertOpen(true);
  };

  const onUpdateFail = (message) => {
    setSnackbarAlertMessage(message);
    setSnackbarAlertOpen(true);
  };

  const [approveGrantApplication] = useMutation(APPROVE_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById'],
    onCompleted: () => onUpdateSuccess('Grant application approved'),
    onError: () => onUpdateFail('Failed to approve grant application'),
  });

  const [reopenGrantApplication] = useMutation(REOPEN_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById'],
    onCompleted: () => onUpdateSuccess('Grant application reopened'),
    onError: () => onUpdateFail('Failed to reopen grant application'),
  });

  const [requestChanges] = useMutation(REQUEST_CHANGE_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById', 'getGrantApplicationComments'],
    onCompleted: () => onUpdateSuccess('Grant application change requested'),
    onError: () => onUpdateFail('Failed to request changes for grant application'),
  });

  const [rejectGrantApplication] = useMutation(REJECT_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById', 'getGrantApplicationComments'],
    onCompleted: () => onUpdateSuccess('Grant application rejected'),
    onError: () => onUpdateFail('Failed to reject grant application'),
  });

  const paymentExists = useMemo(
    () => [PAYMENT_STATUS.PAID, PAYMENT_STATUS.PROCESSING].includes(grantApplication?.paymentStatus),
    [grantApplication?.paymentStatus]
  );

  const isStatusWithNoContent = useMemo(
    () =>
      [
        GRANT_APPLICATION_STATUSES.OPEN,
        GRANT_APPLICATION_STATUSES.WAITING_FOR_REVIEW,
        GRANT_APPLICATION_STATUSES.APPROVED,
      ].includes(status),
    [status]
  );

  if (paymentExists) {
    return null;
  }

  const GRANT_APPLICATION_COMMENT_ACTIONS = {
    [GRANT_APPLICATION_COMMENT_TYPE.CHANGE_REQUESTED]: () =>
      requestChanges({ variables: { grantApplicationId: grantApplication.id } }).then(() => setCommentType(null)),
    [GRANT_APPLICATION_COMMENT_TYPE.REJECTED]: () =>
      rejectGrantApplication({ variables: { grantApplicationId: grantApplication.id } }).then(() =>
        setCommentType(null)
      ),
  };

  const BUTTONS_CONFIG = [
    {
      label: [
        GRANT_APPLICATION_STATUSES.APPROVED,
        GRANT_APPLICATION_STATUSES.APPROVED_AND_PROCESSING,
        GRANT_APPLICATION_STATUSES.APPROVED_AND_PAID,
      ].includes(status)
        ? 'Undo Approval'
        : 'Approve',
      gradient:
        status === GRANT_APPLICATION_STATUSES.APPROVED
          ? 'linear-gradient(259.59deg, #FFD653 0%, #7427FF 93.38%)'
          : 'linear-gradient(259.59deg, #06FFA5 0%, #7427FF 93.38%)',
      commentType: null,
      disabled:
        commentType ||
        [GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED, GRANT_APPLICATION_STATUSES.REJECTED].includes(status),
      action: () =>
        status === GRANT_APPLICATION_STATUSES.APPROVED
          ? reopenGrantApplication({
              variables: {
                grantApplicationId: grantApplication.id,
              },
            })
          : approveGrantApplication({
              variables: {
                grantApplicationId: grantApplication.id,
              },
            }),
    },
    {
      label: status === GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED ? 'Undo request changes' : 'Request changes',
      gradient: 'linear-gradient(259.59deg, #FFD653 0%, #7427FF 93.38%)',
      commentType: GRANT_APPLICATION_COMMENT_TYPE.CHANGE_REQUESTED,
      disabled:
        (commentType && commentType !== GRANT_APPLICATION_COMMENT_TYPE.CHANGE_REQUESTED) ||
        [GRANT_APPLICATION_STATUSES.APPROVED, GRANT_APPLICATION_STATUSES.REJECTED].includes(status),
      action: () =>
        status === GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED
          ? reopenGrantApplication({
              variables: {
                grantApplicationId: grantApplication.id,
              },
            })
          : setCommentType(GRANT_APPLICATION_COMMENT_TYPE.CHANGE_REQUESTED),
    },
    {
      label: status === GRANT_APPLICATION_STATUSES.REJECTED ? 'Undo rejection' : 'Reject',
      gradient: 'linear-gradient(259.59deg, #F93701 0%, #7427FF 93.38%)',
      commentType: GRANT_APPLICATION_COMMENT_TYPE.REJECTED,
      disabled:
        (commentType && commentType !== GRANT_APPLICATION_COMMENT_TYPE.REJECTED) ||
        [GRANT_APPLICATION_STATUSES.APPROVED, GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED].includes(status),
      action: () =>
        status === GRANT_APPLICATION_STATUSES.REJECTED
          ? reopenGrantApplication({
              variables: {
                grantApplicationId: grantApplication.id,
              },
            })
          : setCommentType(GRANT_APPLICATION_COMMENT_TYPE.REJECTED),
    },
  ];

  return (
    <GrantApplicationStatusWrapper>
      <Grid display="flex" justifyContent="space-between" alignItems="center" gap="10px">
        {!paymentExists
          ? BUTTONS_CONFIG.map((buttonConfig, index) => {
              if (buttonConfig.disabled) {
                return null;
              }
              return (
                <Button
                  key={index}
                  onClick={buttonConfig.action}
                  gradient={buttonConfig.gradient}
                  disabled={buttonConfig.disabled}
                >
                  {buttonConfig.label}
                </Button>
              );
            })
          : null}
      </Grid>
      {!!commentType || !isStatusWithNoContent ? <Divider /> : null}
      {!!commentType || !isStatusWithNoContent ? (
        <Grid width="100%">
          <CommentList
            // need to rename comment list submissions & tasks to something more generic
            task={grantApplication}
            type={commentType}
            entityType={ENTITIES_TYPES.GRANT_APPLICATION}
            onCommentCallback={GRANT_APPLICATION_COMMENT_ACTIONS[commentType]}
            showCommentBox={commentType}
            renderComment={(comments) => <RenderNote comments={comments} statusToFilter={status} />}
          />
        </Grid>
      ) : null}
    </GrantApplicationStatusWrapper>
  );
};

export const WalletAddressViewer = ({ walletAddress }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [ensOrAddress, setEnsOrAddress] = useState(walletAddress);
  const wonderWeb3 = useWonderWeb3();

  useEffect(() => {
    wonderWeb3.getENSNameFromEthAddress(walletAddress).then((ensName) => setEnsOrAddress(ensName || walletAddress));
  }, [walletAddress]);

  const handleAddressCopy = (e) => {
    e.stopPropagation();
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(`${walletAddress}`);
  };

  const walletAddressText = useMemo(
    () => (ensOrAddress?.includes('.eth') ? ensOrAddress : `${ensOrAddress?.slice(0, 8)}...${ensOrAddress?.slice(-4)}`),
    [ensOrAddress]
  );

  return (
    <WalletAddressWrapper>
      <DataDisplayWrapper onClick={handleAddressCopy}>
        {isCopied ? 'Address copied!' : `${walletAddressText}`}
        {!isCopied && <CopyIcon />}
      </DataDisplayWrapper>
    </WalletAddressWrapper>
  );
};

export const PaymentHandler = ({ grantApplication }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const togglePayments = () => setIsPaymentModalOpen((prevState) => !prevState);

  if (isPaymentModalOpen) {
    return (
      <MakePaymentModal
        open={isPaymentModalOpen}
        handleClose={() => {}}
        handleGoBack={() => setIsPaymentModalOpen(false)}
        setShowPaymentModal={setIsPaymentModalOpen}
        taskOrGrant={grantApplication?.grant}
        submissionOrApplication={{
          // SOURCE OF TRUTH FOR THE GRANT APPLICATION ORG / POD IS GRANT'S ORG / POD
          ...grantApplication,
          podId: grantApplication?.grant?.podId,
          orgId: grantApplication?.grant?.orgId,
        }}
        entityType={ENTITIES_TYPES.GRANT_APPLICATION}
      />
    );
  }

  return (
    <GrantApplicationStatusWrapper>
      <Grid display="flex" justifyContent="space-between" alignItems="center" gap="20px">
        <HeaderButton type="button" onClick={togglePayments}>
          Proceed to payment
        </HeaderButton>
        <Typography
          whiteSpace="nowrap"
          fontFamily={typography.fontFamily}
          color={palette.grey250}
          fontWeight={400}
          fontSize="13px"
        >
          Sending to
        </Typography>
        <WalletAddressViewer walletAddress={grantApplication?.paymentAddress} />
      </Grid>
    </GrantApplicationStatusWrapper>
  );
};

export const PodViewer = ({ grantApplication }) => {
  const router = useRouter();
  const pod = grantApplication?.pod;
  const globalContext = useGlobalContext();
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const userPermissionsContext = getUserPermissionContext();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: grantApplication?.orgId,
  });
  const [createGranApplicationPod] = useMutation(CREATE_GRANT_APPLICATION_POD, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById'],
    onCompleted: (data) => {
      if (data?.createGranApplicationPod?.podId) {
        router.push(`/pod/${data?.createGranApplicationPod?.podId}/home?firstTime=true`);
      }
    },
  });

  // this is using permission from the org that's applying
  const canCreatePod =
    permissions?.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions?.includes(PERMISSIONS.MANAGE_POD) ||
    permissions?.includes(PERMISSIONS.MANAGE_GRANTS);
  const handleCreateWorkspaceClick = () => {
    createGranApplicationPod({ variables: { grantApplicationId: grantApplication?.id } });
  };
  if (!pod && canCreatePod)
    return (
      <CreateWorkspaceWrapper style>
        <HeaderButton
          onClick={handleCreateWorkspaceClick}
          reversed
          style={{
            width: 'fit-content',
          }}
          type="button"
        >
          Create Pod Workspace
        </HeaderButton>
      </CreateWorkspaceWrapper>
    );
  if (pod) {
    return (
      <TaskMintWrapper>
        <UnstyledLink href={`/pod/${pod?.id}/home`}>
          <Grid display="flex" gap="8px" alignItems="center">
            <PodIcon
              color={pod?.color}
              style={{
                width: 28,
                height: 28,
                borderRadius: 50,
              }}
            />
            <Typography fontFamily={typography.fontFamily} color={palette.white} fontSize="13px" fontWeight={500}>
              {pod?.name}
            </Typography>
          </Grid>
        </UnstyledLink>
        <UnstyledLink href={`/pod/${pod?.id}/home`}>
          <HeaderButton
            reversed
            style={{
              width: 'fit-content',
            }}
            type="button"
          >
            Workspace
          </HeaderButton>
        </UnstyledLink>
      </TaskMintWrapper>
    );
  }
};

export const OrgViewer = ({ grantApplication }) => {
  const org = grantApplication?.org;

  if (!org) return null;
  return (
    <WalletAddressWrapper disableHoverStroke>
      <DataDisplayWrapper>
        <OrgComponent
          username={org.username}
          profilePicture={org.profilePicture}
          linkStyle={{
            display: 'flex',
          }}
          style={{
            height: '18px',
            width: '18px',
          }}
        />
        <Typography fontFamily={typography.fontFamily} color={palette.white} fontSize="13px" fontWeight={500}>
          {org.name}
        </Typography>
      </DataDisplayWrapper>
    </WalletAddressWrapper>
  );
};
