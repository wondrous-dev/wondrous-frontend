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
import { GET_ORG_TASK_BOARD_PROPOSALS } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { useGlobalContext, useOrgBoard, usePodBoard } from 'utils/hooks';
import { LIMIT } from 'services/board';
import { formatDateDisplay } from 'utils/board';
import { formatDistance } from 'date-fns';
import { useRouter } from 'next/router';
import { Tooltip } from '@mui/material';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { delQuery } from 'utils/index';
import SmartLink from '../SmartLink';
import VoteResults from '../Votes';
import PodIconName from '../PodIconName';
import { TaskAction, TaskActionAmount } from '../Task/styles';

const PROPOSAL_TYPES = {
  WONDER: 'wonder',
  SNAPSHOT: 'snapshot',
};

const proposalStatuses = [
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

const NewProposalButton = ({ handleOpenModal }) => (
  <AddProposalButtonContainer onClick={handleOpenModal}>
    <AddSvg />
    <AddProposalButtonContainerText>New Proposal</AddProposalButtonContainerText>
  </AddProposalButtonContainer>
);

const ProposalItem = (props) => {
  const { proposalVoteType, proposal, proposalStatus } = props;
  console.log('proposal', proposal);
  const router = useRouter();
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
          {proposalVoteType === 'snapshot' ? <SnapshotSvg /> : <WonderSvg />}
          <ProposalItemCreatorSafeImg src={proposal?.creatorProfilePicture} />
          <ProposalItemCreatorText>
            By{' '}
            <ProposalCreatorLink href={`/profile/${proposal?.creatorUsername}/about`} target="_blank">
              {proposal?.creatorUsername}
            </ProposalCreatorLink>{' '}
          </ProposalItemCreatorText>
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
            <VoteText>votes</VoteText>
          </TotalVoteContainer>
        </ProposalHeaderDiv>
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

const ProposalBoard = () => {
  const [openProposalModal, setOpenProposalModal] = useState(false);
  const [status, setStatus] = useState(proposalStatuses[0].label);
  const [proposalType, setProposalType] = useState(PROPOSAL_TYPES.WONDER);
  const handleOpenModal = () => {
    setOpenProposalModal((prevState) => !prevState);
  };
  const [filters, setFilters] = useState({
    podIds: [],
    priorities: [],
    labelId: null,
  });
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;

  const [getOrgTaskBoardProposals, { data, fetchMore }] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      // console.log(error, 'err=');
      // setIsLoading(false);
    },
  });

  useEffect(() => {
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
  }, [status]);
  const taskProposals = data?.getOrgTaskBoardProposals || [];

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
            {proposalStatuses.map((status) => (
              <LeftSideTab key={status?.label}>
                {status.image}
                <LeftSideTabText>{status.label}</LeftSideTabText>
              </LeftSideTab>
            ))}
          </LeftSectionContainer>
          <LeftSideText>Proposal type</LeftSideText>
          <LeftSectionContainer>
            <LeftSideTab>
              <WonderSvg />
              <LeftSideTabText>Wonder</LeftSideTabText>
            </LeftSideTab>
            <LeftSideTab>
              <SnapshotSvg />
              <LeftSideTabText>Snapshot</LeftSideTabText>
            </LeftSideTab>
          </LeftSectionContainer>
        </LeftSideContainer>
        <RightSideContainer>
          {taskProposals?.length > 0 ? (
            <>
              {taskProposals?.map((proposal) => (
                <ProposalItem proposal={proposal} proposalStatus={status} />
              ))}
            </>
          ) : (
            <EmptyDiv>
              <NewProposalButton handleOpenModal={handleOpenModal} />
            </EmptyDiv>
          )}
        </RightSideContainer>
      </ProposalBoardContainer>
    </>
  );
};

export default ProposalBoard;
