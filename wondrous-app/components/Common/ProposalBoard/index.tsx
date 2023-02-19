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
import { useState } from 'react';
import CreateButton from 'components/ProjectProfile/CreateButton';

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

const NewProposalButton = () => (
  <AddProposalButtonContainer>
    <AddSvg />
    <AddProposalButtonContainerText>New Proposal</AddProposalButtonContainerText>
  </AddProposalButtonContainer>
);

const ProposalBoard = () => {
  const [tab, setTab] = useState(0);
  return (
    <ProposalBoardContainer>
      <LeftSideContainer>
        <LeftNewProposalContainer>
          <NewProposalButton />
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
        <EmptyDiv>
          <NewProposalButton />
        </EmptyDiv>
      </RightSideContainer>
    </ProposalBoardContainer>
  );
};

export default ProposalBoard;
