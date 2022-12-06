import { useMutation } from '@apollo/client';
import { REMOVE_TASK_PROPOSAL_VOTE, VOTE_FOR_PROPOSAL } from 'graphql/mutations/taskProposal';
import { STATUS_OPEN } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import { VotedForCheckMark, NotVotedCheckmark } from 'components/Icons/VotedForCheckmark';
import palette from 'theme/palette';

import {
  VoteResultsWrapper,
  VoterProfilePicture,
  VoteLabel,
  VoteRowWrapper,
  VoteProgressBar,
  VoteCurrentProgress,
  VoteRowContentWrapper,
} from './styles';

const computePercentage = (votes, type) => {
  const amount = votes?.counts[type] || 0;
  return Math.round((100 * amount) / votes.totalVotes) || 0;
};

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
function VoteOptionsRow({ votes, option, handleVote, handleUndoVote, user, voteType }) {
  const percentage = computePercentage(votes, option);
  const userVotedFor = votes?.userVote === option;
  let optionDisplayName = option;
  if (voteType === 'binary') {
    optionDisplayName = option === 'approve' ? 'Yes' : 'No';
  }
  return (
    <VoteRowWrapper key={`${option}`}>
      <VoteRowContentWrapper onClick={() => handleVote(option)}>
        <div style={{ display: 'flex', gap: 5 }}>
          <VoteLabel color={palette.blue20}>{percentage}%</VoteLabel>
          <VoteLabel color={palette.white} weight={500}>
            {optionDisplayName}
          </VoteLabel>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {userVotedFor ? (
            <>
              <VoteLabel
                style={{ cursor: 'pointer' }}
                color={palette.highlightBlue}
                weight={500}
                onClick={(e) => handleUndoVote(e)}
              >
                Undo vote
              </VoteLabel>
              <VoterProfilePicture src={user?.thumbnailPicture || user?.profilePicture} />
              <VotedForCheckMark />{' '}
            </>
          ) : (
            <NotVotedCheckmark />
          )}
        </div>
      </VoteRowContentWrapper>
      <VoteProgressBar>
        <VoteCurrentProgress color="linear-gradient(90deg, #4F00DE 65%, #06FFA5 100%)" width={`${percentage}%`} />
      </VoteProgressBar>
    </VoteRowWrapper>
  );
}

export default function VoteResults({ userInOrg, proposal, fullScreen, proposalStatus }: Props) {
  const { votes } = proposal;
  const { totalVotes } = votes;
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

  return (
    <VoteResultsWrapper isFullScreen={fullScreen}>
      {proposal?.voteOptions?.map((option) => (
        <VoteOptionsRow
          key={option}
          voteType={proposal?.voteType}
          votes={votes}
          option={option}
          handleVote={handleVote}
          handleUndoVote={handleUndoVote}
          user={user}
        />
      ))}
      {proposal?.voteType === 'binary' &&
        binaryOptions.map((option) => (
          <VoteOptionsRow
            key={option}
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
      {/* {ROWS_CONFIG.map((row, idx) => {
        const percentage = computePercentage(row.key);
        const isVoted = userVote === row.key;
        return (
          <VoteRowWrapper key={idx}>
            {showActions && (
              <VoteButton
                isVoted={userVote === row.key}
                onClick={row.action}
                type="button"
                hoverColor={row.btnHoverColor}
                color={row.color}
                disabled={isVoted}
              >
                <VoteButtonLabel isVoted={isVoted} color={row.color}>
                  {row.btnLabel}
                </VoteButtonLabel>
              </VoteButton>
            )}
            <VoteRowResult>
              <VotePercentageResult>{percentage}%</VotePercentageResult> voted {!showActions && row.key}
            </VoteRowResult>
            <VoteProgressBar>
              <VoteCurrentProgress color={row.color} width={`${percentage}%`} />
            </VoteProgressBar>
          </VoteRowWrapper>
        );
      })} */}
    </VoteResultsWrapper>
  );
}
