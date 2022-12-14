import { useMutation } from '@apollo/client';
import { REMOVE_TASK_PROPOSAL_VOTE, VOTE_FOR_PROPOSAL } from 'graphql/mutations/taskProposal';
import { STATUS_OPEN } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import palette from 'theme/palette';
import VoteOptionRow from 'components/Common/Votes/VoteOptionRow';

import { VoteResultsWrapper, VoteLabel } from './styles';

interface Props {
  fullScreen: boolean;
  proposal: {
    id: string;
    orgId: string;
    podId: string;
    org: {
      privacyLevel: string;
    };
    pod: {
      privacyLevel: string;
    };
    votes: {
      counts: Record<string, number>;
      userVote: string;
      totalVotes: number;
    };
    voteOptions: string[];
    voteType: 'binary' | 'custom';
  };
  proposalStatus: string;
  userInOrg: boolean;
}

export default function VoteResults({ userInOrg, proposal, fullScreen, proposalStatus }: Props) {
  const { votes } = proposal;
  const { totalVotes } = votes || {};
  const proposalId = proposal.id;
  const user = useMe();

  const canVote = user && userInOrg && proposalStatus === STATUS_OPEN; // TODO add logic for private pod proposals?
  const proposalRefetchQueries = ['getTaskProposalById'];
  const [voteForProposal] = useMutation(VOTE_FOR_PROPOSAL, {
    refetchQueries: proposalRefetchQueries,
  });

  const [removeProposalVote] = useMutation(REMOVE_TASK_PROPOSAL_VOTE, {
    refetchQueries: proposalRefetchQueries,
  });

  const handleVote = (option) => {
    if (!canVote) return;
    voteForProposal({ variables: { taskProposalId: proposalId, choice: option } });
  };

  const handleUndoVote = (e) => {
    if (!canVote) return;
    e.preventDefault();
    e.stopPropagation();
    removeProposalVote({ variables: { taskProposalId: proposalId } });
  };

  const binaryOptions = ['approve', 'reject'];

  if (!votes) {
    return null;
  }

  return (
    <VoteResultsWrapper isFullScreen={fullScreen}>
      {proposal?.voteType === 'custom' &&
        proposal?.voteOptions?.map((option) => (
          <VoteOptionRow
            key={option}
            canVote={canVote}
            voteType={proposal?.voteType}
            votes={votes}
            option={option}
            handleVote={handleVote}
            handleUndoVote={handleUndoVote}
            user={user}
          />
        ))}
      {(proposal?.voteType === 'binary' || !proposal?.voteType) &&
        binaryOptions.map((option) => (
          <VoteOptionRow
            key={option}
            canVote={canVote}
            voteType={proposal?.voteType}
            votes={votes}
            option={option}
            handleVote={handleVote}
            handleUndoVote={handleUndoVote}
            user={user}
          />
        ))}
      <VoteLabel color={palette.white} weight={500}>
        Total Votes: {totalVotes}
      </VoteLabel>
    </VoteResultsWrapper>
  );
}
