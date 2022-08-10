import RetractVoteIcon from 'components/Icons/retractVote';
import { useMutation } from '@apollo/client';
import {
  UPVOTE_TASK_PROPOSAL,
  DOWNVOTE_TASK_PROPOSAL,
  REMOVE_TASK_PROPOSAL_VOTE,
} from 'graphql/mutations/taskProposal';
import { ProposalVoteType, PROPOSAL_VOTE_LABELS, STATUS_OPEN } from 'utils/constants';
import { useMe } from 'components/Auth/withAuth';
import {
  VoteResultsWrapper,
  VoteButton,
  VoteRowWrapper,
  VoteProgressBar,
  VoteCurrentProgress,
  VoteRowResult,
  VotePercentageResult,
  RetractButton,
  VoteButtonLabel,
} from './styles';

interface Props {
  votes: {
    counts: {
      approve: number;
      reject: number;
    };
    userVote: string;
  };
  fullScreen: boolean;
  taskId: string;
  totalVotes: number;
  proposalStatus: string;
}

export default function VoteResults({ votes, fullScreen, taskId, totalVotes, proposalStatus }: Props) {
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
  const upvote = () => upvoteProposal({ variables: { taskProposalId: taskId } });

  const downvote = () => downvoteProposal({ variables: { taskProposalId: taskId } });

  const retract = () => removeProposalVote({ variables: { taskProposalId: taskId } });

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
  return (
    <VoteResultsWrapper isFullScreen={fullScreen}>
      {ROWS_CONFIG.map((row, idx) => {
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
      })}
      {votes?.userVote && showActions && (
        <RetractButton onClick={retract}>
          <RetractVoteIcon />
          Retract vote
        </RetractButton>
      )}
    </VoteResultsWrapper>
  );
}
