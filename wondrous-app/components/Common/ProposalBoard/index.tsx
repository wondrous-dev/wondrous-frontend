import {
  LeftSectionContainer,
  LeftNewProposalContainer,
  LeftSideContainer,
  ProposalBoardContainer,
  LeftSideText,
  LeftSideTab,
  LeftSideTabText,
  AddProposalButtonContainer,
  AddProposalButtonContainerText,
  RightSideContainer,
  EmptyDiv,
  EmptyDivText,
  ProposalItemContainer,
  ProposalHeaderDiv,
  ProposalItemCreatorSafeImg,
  ProposalItemCreatorText,
  ProposalItemCreatedTimeago,
  TotalVoteContainer,
  TotalVoteNumber,
  VoteText,
  ProposalCreatorLink,
  ProposalItemFooter,
  ProposalItemTitle,
  ProposalItemDescription,
} from 'components/Common/ProposalBoard/styles';
import GreenEclipse from 'components/Common/ProposalBoard/images/green-eclipse.svg';
import RedEclipse from 'components/Common/ProposalBoard/images/red-eclipse.svg';
import PurpleEclipse from 'components/Common/ProposalBoard/images/purple-eclipse.svg';
import GreyEclipse from 'components/Common/ProposalBoard/images/grey-eclipse.svg';
import SnapshotSvg from 'components/Common/ProposalBoard/images/snapshot.svg';
import WonderSvg from 'components/Common/ProposalBoard/images/wonder.svg';
import AddSvg from 'components/Common/ProposalBoard/images/add.svg';
import { useCallback, useEffect, useState } from 'react';
import CreateButton from 'components/ProjectProfile/CreateButton';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal';
import { ENTITIES_TYPES } from 'utils/constants';
import { GET_ORG_TASK_BOARD_PROPOSALS, GET_POD_TASK_BOARD_PROPOSALS } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { useGlobalContext, useOrgBoard, usePodBoard } from 'utils/hooks';
import { LIMIT } from 'services/board';
import { formatDateDisplay } from 'utils/board';
import { formatDistance } from 'date-fns';
import { useRouter } from 'next/router';
import { Tooltip } from '@mui/material';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { delQuery } from 'utils/index';
import palette from 'theme/palette';
import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import { useSnapshot } from 'services/snapshot';
import { useInView } from 'react-intersection-observer';
import { Props } from 'components/organization/boards/boards';
import SmartLink from '../SmartLink';
import VoteResults, { SnapshotVoteResults } from '../Votes';
import PodIconName from '../PodIconName';
import { TaskAction, TaskActionAmount } from '../Task/styles';
import { LoadMore } from '../KanbanBoard/styles';

const PROPOSAL_TYPES = {
  WONDER: 'wonder',
  SNAPSHOT: 'snapshot',
};

const wonderProposalStatuses = [
  {
    label: 'open',
    image: <PurpleEclipse />,
  },
  {
    label: 'approved',
    image: <GreenEclipse />,
  },
  {
    label: 'rejected',
    image: <RedEclipse />,
  },
  {
    label: 'archived',
    image: <GreyEclipse />,
  },
];

const SNAPSHOT_STATUSES = {
  active: 'active',
  closed: 'closed',
};

const snapshotProposalsStatuses = [
  {
    label: SNAPSHOT_STATUSES.active,
    image: <PurpleEclipse />,
  },
  {
    label: SNAPSHOT_STATUSES.closed,
    image: <GreyEclipse />,
  },
];

const NewProposalButton = ({ handleOpenModal }) => (
  <AddProposalButtonContainer onClick={handleOpenModal}>
    <AddSvg />
    <AddProposalButtonContainerText>New Proposal</AddProposalButtonContainerText>
  </AddProposalButtonContainer>
);

const SnapshotProposalItem = (props) => {
  const { proposal, spaceName } = props;

  const voteOptions = proposal.choices.map((choice, index) => ({
    optionDisplayName: choice,
    voteNumber: proposal?.scores[index],
  }));

  return (
    <a
      style={{
        textDecoration: 'none',
      }}
      href={`https://snapshot.org/#/${spaceName}/proposal/${proposal?.id}`}
      target="_blank"
      rel="noreferrer"
    >
      <ProposalItemContainer>
        <ProposalHeaderDiv>
          <SnapshotSvg />
          <ProposalItemCreatedTimeago>
            {formatDistance(new Date(proposal?.start * 1000), new Date(), {
              addSuffix: true,
            })}
          </ProposalItemCreatedTimeago>
          <TotalVoteContainer
            style={{
              marginLeft: '10px',
            }}
          >
            <TotalVoteNumber>
              Ends in{' '}
              {formatDistance(new Date(proposal?.end * 1000), new Date(), {
                addSuffix: true,
              })}
            </TotalVoteNumber>
          </TotalVoteContainer>
          <div
            style={{
              flex: 1,
            }}
          />
          <TotalVoteContainer>
            <TotalVoteNumber>
              {proposal?.scores_total || 0}
              {` `}
            </TotalVoteNumber>
            <VoteText>{proposal?.scores_total !== 1 ? 'votes' : 'vote'}</VoteText>
          </TotalVoteContainer>
        </ProposalHeaderDiv>
        <ProposalItemTitle>{proposal?.title}</ProposalItemTitle>
        {proposal?.description && (
          <ProposalItemDescription>
            <PlateRichTextViewer text={proposal?.description} />
          </ProposalItemDescription>
        )}
        <SnapshotVoteResults voteOptions={voteOptions} totalVotes={proposal.scores_total} />
      </ProposalItemContainer>
    </a>
  );
};

const WonderProposalItem = (props) => {
  const { proposalVoteType, proposal, proposalStatus } = props;
  const router = useRouter();
  const isWonder = PROPOSAL_TYPES.WONDER === proposalVoteType;
  const globalContext = useGlobalContext();
  const getUserPermissionContext = useCallback(() => globalContext?.userPermissionsContext, [globalContext]);
  const userPermissionsContext = getUserPermissionContext();
  const userInOrg = userPermissionsContext?.orgPermissions && proposal?.orgId in userPermissionsContext.orgPermissions;
  const viewUrl = `${delQuery(router.asPath)}?taskProposal=${proposal?.id}&entity=proposal`;

  return (
    <SmartLink
      href={viewUrl}
      preventLinkNavigation
      onNavigate={() => {
        const query = {
          ...router.query,
          taskProposal: proposal.id,
        };
        router.push({ query }, undefined, { scroll: false, shallow: true });
      }}
    >
      <ProposalItemContainer>
        <ProposalHeaderDiv>
          <WonderSvg />
          <ProposalItemCreatorSafeImg src={proposal?.creatorProfilePicture} />
          <ProposalItemCreatorText>By {proposal?.creatorUsername}</ProposalItemCreatorText>
          <ProposalItemCreatedTimeago>
            {formatDistance(new Date(proposal?.createdAt), new Date(), {
              addSuffix: true,
            })}
          </ProposalItemCreatedTimeago>
          <div
            style={{
              flex: 1,
            }}
          />
          <TotalVoteContainer>
            <TotalVoteNumber>
              {proposal?.votes?.totalVotes || 0}
              {` `}
            </TotalVoteNumber>
            <VoteText>{proposal?.votes?.totalVotes !== 1 ? 'votes' : 'vote'}</VoteText>
          </TotalVoteContainer>
        </ProposalHeaderDiv>
        <ProposalItemTitle>{proposal?.title}</ProposalItemTitle>
        {proposal?.description && (
          <ProposalItemDescription>
            <PlateRichTextViewer text={proposal?.description} />
          </ProposalItemDescription>
        )}
        <VoteResults userInOrg={userInOrg} fullScreen={false} proposalStatus={proposalStatus} proposal={proposal} />
        <ProposalItemFooter>
          {proposal?.podName && (
            <PodIconName
              color={proposal?.podColor}
              name={proposal?.podName}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/pod/${proposal?.podId}/home`, undefined, {
                  shallow: true,
                });
              }}
            />
          )}
          <div
            style={{
              flex: 1,
            }}
          />
          <Tooltip title="View comments" placement="top">
            <TaskAction>
              <TaskCommentIcon />
              <TaskActionAmount>{proposal?.commentCount}</TaskActionAmount>
            </TaskAction>
          </Tooltip>
        </ProposalItemFooter>
      </ProposalItemContainer>
    </SmartLink>
  );
};

const ProposalBoard = (props: Props) => {
  const [openProposalModal, setOpenProposalModal] = useState(false);
  const [status, setStatus] = useState(wonderProposalStatuses[0].label);
  const [proposalType, setProposalType] = useState(PROPOSAL_TYPES.WONDER);
  const [ref, inView] = useInView({});
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  // snapshot integration
  const { getOrgSnapshotInfo, orgSnapshot, getSnapshotProposals, fetchMoreSnapshotProposalData, snapshotProposals } =
    useSnapshot();

  const handleOpenModal = () => {
    setOpenProposalModal((prevState) => !prevState);
  };

  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const filters = board?.filters;
  const [getOrgTaskBoardProposals, { data, fetchMore: fetchMoreOrgProposals }] = useLazyQuery(
    GET_ORG_TASK_BOARD_PROPOSALS,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      onError: (error) => {
        // console.log(error, 'err=');
        // setIsLoading(false);
      },
    }
  );

  const [getPodTaskBoardProposals, { data: podTaskBoardProposalData, fetchMore: fetchMorePodProposals }] = useLazyQuery(
    GET_POD_TASK_BOARD_PROPOSALS,
    {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (board?.orgId || orgBoard?.id) {
      getOrgSnapshotInfo({
        variables: {
          orgId: board?.orgId || orgBoard?.id,
        },
      });
    }
  }, [board?.orgId || orgBoard?.id]);
  const isWonder = proposalType === PROPOSAL_TYPES.WONDER;
  const isSnapshot = proposalType === PROPOSAL_TYPES.SNAPSHOT;
  useEffect(() => {
    if (isWonder) {
      if (podBoard) {
        getPodTaskBoardProposals({
          variables: {
            input: {
              podId: podBoard?.podId,
              priorities: filters?.priorities,
              statuses: [status],
              offset: 0,
              labelId: filters?.labelId,
              limit: LIMIT,
            },
          },
        });
      } else if (orgBoard) {
        getOrgTaskBoardProposals({
          variables: {
            podIds: filters?.podIds,
            priorities: filters?.priorities,
            orgId: board?.orgId,
            statuses: [status],
            offset: 0,
            labelId: filters?.labelId,
            limit: LIMIT,
          },
        });
      }
    } else if (isSnapshot && orgSnapshot && Object.prototype.hasOwnProperty.call(SNAPSHOT_STATUSES, status)) {
      getSnapshotProposals({
        variables: {
          state: status,
          spaceName: orgSnapshot?.snapshotEns,
        },
      });
    }
  }, [status, isWonder, isSnapshot, orgSnapshot, podBoard, orgBoard]);

  const taskProposals = isWonder
    ? podTaskBoardProposalData?.getPodTaskBoardProposals || data?.getOrgTaskBoardProposals || []
    : snapshotProposals || [];

  // pagination
  const getOrgProposalsFetchMore = useCallback(() => {
    fetchMoreOrgProposals({
      variables: {
        offset: taskProposals?.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setHasMore(fetchMoreResult?.getOrgTaskBoardProposals.length >= LIMIT);
        const getOrgTaskBoardProposals = [
          ...prev.getOrgTaskBoardProposals,
          ...fetchMoreResult.getOrgTaskBoardProposals,
        ];
        return {
          getOrgTaskBoardProposals,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [setHasMore, taskProposals]);

  const getPodProposalsFetchMore = useCallback(() => {
    fetchMorePodProposals({
      variables: {
        offset: taskProposals?.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setHasMore(fetchMoreResult?.getPodTaskBoardProposals.length >= LIMIT);
        const getPodTaskBoardProposals = [
          ...prev.getPodTaskBoardProposals,
          ...fetchMoreResult.getPodTaskBoardProposals,
        ];
        return {
          getPodTaskBoardProposals,
        };
      },
    });
  }, [setHasMore, taskProposals]);

  const getSnapshotProposalsFetchMore = useCallback(() => {
    fetchMoreSnapshotProposalData({
      variables: {
        skip: taskProposals?.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setHasMore(fetchMoreResult?.proposals?.length >= LIMIT);
        const proposals = [...prev.proposals, ...fetchMoreResult.proposals];
        return {
          proposals,
        };
      },
    }).catch((error) => {
      console.log(error);
    });
  }, [setHasMore, taskProposals]);

  useEffect(() => {
    if (inView && hasMore && LIMIT <= taskProposals.length) {
      if (isWonder) {
        if (podBoard) {
          getPodProposalsFetchMore();
        } else {
          getOrgProposalsFetchMore();
        }
      } else if (isSnapshot && orgSnapshot) {
        getSnapshotProposalsFetchMore();
      }
    }
  }, [inView, hasMore, taskProposals, isWonder, isSnapshot, orgSnapshot, status, podBoard]);
  const proposalStatuses = isWonder ? wonderProposalStatuses : snapshotProposalsStatuses;

  return (
    <>
      <CreateModalOverlay open={openProposalModal} onClose={handleOpenModal}>
        <CreateEntityModal
          entityType={ENTITIES_TYPES.PROPOSAL}
          handleClose={handleOpenModal}
          resetEntityType={() => {}}
          setEntityType={() => {}}
          cancel={handleOpenModal}
        />
      </CreateModalOverlay>
      <ProposalBoardContainer>
        <LeftSideContainer>
          <LeftNewProposalContainer>
            <NewProposalButton handleOpenModal={handleOpenModal} />
          </LeftNewProposalContainer>
          <LeftSideText>Status</LeftSideText>
          <LeftSectionContainer>
            {isWonder ? <></> : <></>}
            {proposalStatuses.map((proposalStatus) => (
              <LeftSideTab
                key={proposalStatus?.label}
                onClick={() => setStatus(proposalStatus?.label)}
                style={{
                  background: proposalStatus?.label === status ? palette.grey87 : palette.grey900,
                }}
              >
                {proposalStatus.image}
                <LeftSideTabText>{proposalStatus.label}</LeftSideTabText>
              </LeftSideTab>
            ))}
          </LeftSectionContainer>
          <LeftSideText>Proposal type</LeftSideText>
          <LeftSectionContainer>
            <LeftSideTab
              onClick={() => {
                setProposalType(PROPOSAL_TYPES.WONDER);
                setStatus(wonderProposalStatuses[0].label);
              }}
              style={{
                background: proposalType === PROPOSAL_TYPES.WONDER ? palette.grey87 : palette.grey900,
              }}
            >
              <WonderSvg />
              <LeftSideTabText>Wonder</LeftSideTabText>
            </LeftSideTab>
            <LeftSideTab
              onClick={() => {
                setProposalType(PROPOSAL_TYPES.SNAPSHOT);
                setStatus(snapshotProposalsStatuses[0].label);
              }}
              style={{
                background: proposalType === PROPOSAL_TYPES.SNAPSHOT ? palette.grey87 : palette.grey900,
              }}
            >
              <SnapshotSvg />
              <LeftSideTabText>Snapshot</LeftSideTabText>
            </LeftSideTab>
          </LeftSectionContainer>
        </LeftSideContainer>
        <RightSideContainer>
          {podBoard && isSnapshot && (
            <LeftSideTabText
              style={{
                textTransform: 'none',
                marginBottom: '8px',
              }}
            >
              The Snapshot proposals shown here are org wide and not limited to this pod.
            </LeftSideTabText>
          )}
          {taskProposals?.length > 0 ? (
            <>
              {taskProposals?.map((proposal) => (
                <>
                  {isWonder ? (
                    <WonderProposalItem proposal={proposal} proposalStatus={status} />
                  ) : (
                    <SnapshotProposalItem
                      proposal={proposal}
                      proposalStatus={status}
                      spaceName={orgSnapshot?.snapshotEns}
                    />
                  )}
                </>
              ))}
            </>
          ) : (
            <EmptyDiv>
              {proposalType === PROPOSAL_TYPES.WONDER ? (
                <>
                  {status === wonderProposalStatuses[0].label ? (
                    <NewProposalButton handleOpenModal={handleOpenModal} />
                  ) : (
                    <LeftSideTabText
                      style={{
                        textTransform: 'none',
                      }}
                    >
                      There are no {status} proposals currently
                    </LeftSideTabText>
                  )}
                </>
              ) : (
                <>
                  {orgSnapshot ? (
                    <LeftSideTabText
                      style={{
                        textTransform: 'none',
                      }}
                    >
                      There are no Snapshot proposals currently
                    </LeftSideTabText>
                  ) : (
                    <LeftSideTabText
                      style={{
                        textTransform: 'none',
                      }}
                    >
                      To get Snapshot proposals, please first connect your Snapshot space{' '}
                      <span
                        style={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          color: palette.highlightBlue,
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(`/organization/settings/${board?.orgId || orgBoard?.id}/integrations`);
                        }}
                      >
                        here
                      </span>
                    </LeftSideTabText>
                  )}
                </>
              )}
            </EmptyDiv>
          )}
          <LoadMore ref={ref} hasMore={hasMore} />
        </RightSideContainer>
      </ProposalBoardContainer>
    </>
  );
};

export default ProposalBoard;
