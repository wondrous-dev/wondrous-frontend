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
} from 'components/Common/ProposalBoard/styles';
import GreenEclipse from 'components/Common/ProposalBoard/images/green-eclipse.svg';
import RedEclipse from 'components/Common/ProposalBoard/images/red-eclipse.svg';
import PurpleEclipse from 'components/Common/ProposalBoard/images/purple-eclipse.svg';
import GreyEclipse from 'components/Common/ProposalBoard/images/grey-eclipse.svg';
import SnapshotSvg from 'components/Common/ProposalBoard/images/snapshot.svg';
import WonderSvg from 'components/Common/ProposalBoard/images/wonder.svg';
import AddSvg from 'components/Common/ProposalBoard/images/add.svg';
import { useEffect, useState } from 'react';
import CreateButton from 'components/ProjectProfile/CreateButton';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityModal from 'components/CreateEntity/CreateEntityModal';
import { ENTITIES_TYPES } from 'utils/constants';
import { GET_ORG_TASK_BOARD_PROPOSALS } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { LIMIT } from 'services/board';

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

const ProposalItem = (props) => {};

const ProposalBoard = () => {
  const [openProposalModal, setOpenProposalModal] = useState(false);
  const [status, setStatus] = useState(proposalStatuses[0].label);
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
  console.log('taskProposals', taskProposals);
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
            <></>
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
