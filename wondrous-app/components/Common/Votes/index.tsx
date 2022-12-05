import RetractVoteIcon from 'components/Icons/retractVote';
import { useMutation } from '@apollo/client';
import {
  UPVOTE_TASK_PROPOSAL,
  DOWNVOTE_TASK_PROPOSAL,
  REMOVE_TASK_PROPOSAL_VOTE,
  VOTE_FOR_PROPOSAL,
} from 'graphql/mutations/taskProposal';
import { ProposalVoteType, PROPOSAL_VOTE_LABELS, STATUS_OPEN } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import { VotedForCheckMark, NotVotedCheckmark } from 'components/Icons/VotedForCheckmark';
import palette from 'theme/palette';

import {
  VoteResultsWrapper,
  VoterProfilePicture,
  VoteLabel,
  VoteButton,
  VoteRowWrapper,
  VoteProgressBar,
  VoteCurrentProgress,
  VoteRowResult,
  RetractButton,
  VoteButtonLabel,
  VoteRowContentWrapper,
} from './styles';

interface Props {
  fullScreen: boolean;
  proposal: {
    id: String;
    votes: {
      counts: Record<string, number>;
      userVote: string;
      totalVotes: number;
    };
    voteOptions: string[];
    voteType: 'binary' | 'custom';
  };
  proposalStatus: string;
}

export default function VoteResults({ proposal, fullScreen, proposalStatus }: Props) {
  const { votes } = proposal;
  const { totalVotes } = votes;
  const proposalId = proposal.id;
  const user = useMe();
  const proposalRefetchQueries = ['getTaskProposalById'];
  const [upvoteProposal] = useMutation(UPVOTE_TASK_PROPOSAL, {
    refetchQueries: proposalRefetchQueries,
  });
  const [downvoteProposal] = useMutation(DOWNVOTE_TASK_PROPOSAL, {
    refetchQueries: proposalRefetchQueries,
  });

  const [removeProposalVote] = useMutation(REMOVE_TASK_PROPOSAL_VOTE, {
    refetchQueries: proposalRefetchQueries,
  });
  const upvote = () => upvoteProposal({ variables: { taskProposalId: proposalId } });

  const downvote = () => downvoteProposal({ variables: { taskProposalId: proposalId } });

  const retract = () => removeProposalVote({ variables: { taskProposalId: proposalId } });

  const userVote = votes?.userVote;

  const ROWS_CONFIG = [
    {
      key: ProposalVoteType.APPROVE,
      btnLabel:
        userVote === ProposalVoteType.APPROVE
          ? PROPOSAL_VOTE_LABELS[ProposalVoteType.APPROVE].VOTED
          : PROPOSAL_VOTE_LABELS[ProposalVoteType.APPROVE].ACTION,
      color: 'linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)',
      btnHoverColor:
        'linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)',
      action: upvote,
    },
    {
      key: ProposalVoteType.REJECT,

      btnLabel:
        userVote === ProposalVoteType.REJECT
          ? PROPOSAL_VOTE_LABELS[ProposalVoteType.REJECT].VOTED
          : PROPOSAL_VOTE_LABELS[ProposalVoteType.REJECT].ACTION,
      color: 'linear-gradient(196.76deg, #FFFFFF -48.71%, #F93701 90.48%)',
      btnHoverColor:
        'linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), linear-gradient(196.76deg, #FFFFFF -48.71%, #F93701 90.48%)',
      action: downvote,
    },
  ];

  const computePercentage = (type) => {
    const amount = votes?.counts[type] || 0;
    return Math.round((100 * amount) / totalVotes) || 0;
  };

  const showActions = user && proposalStatus === STATUS_OPEN;
  console.log('proposal?.voteOptions', proposal?.voteOptions);
  return (
    <VoteResultsWrapper isFullScreen={fullScreen}>
      {proposal?.voteOptions?.map((option, idx) => {
        const percentage = computePercentage(option);
        const userVotedFor = userVote === option;
        return (
          <VoteRowWrapper key={`${option}`}>
            <VoteRowContentWrapper>
              <div style={{ display: 'flex', gap: 5 }}>
                <VoteLabel color={palette.blue20}>{percentage}%</VoteLabel>
                <VoteLabel color={palette.white} weight={500}>
                  {option}
                </VoteLabel>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {userVotedFor ? (
                  <>
                    <VoterProfilePicture src={user?.thumbnailPicture || user?.profilePicture} />
                    <VoteLabel color={palette.highlightBlue} weight={500}>
                      Undo vote
                    </VoteLabel>
                    <VotedForCheckMark />{' '}
                  </>
                ) : (
                  <NotVotedCheckmark />
                )}
              </div>
            </VoteRowContentWrapper>
            <VoteProgressBar>
              <VoteCurrentProgress color="linear-gradient(180deg, #FFFFFF 0%, #06FFA5 100%)" width={`${percentage}%`} />
            </VoteProgressBar>
          </VoteRowWrapper>
        );
      })}
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
