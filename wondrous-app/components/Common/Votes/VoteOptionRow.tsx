import { VotedForCheckMark, NotVotedCheckmark } from 'components/Icons/VotedForCheckmark';
import palette from 'theme/palette';

import {
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

export default function VoteOptionRow({ votes, option, handleVote, handleUndoVote, user, voteType, canVote }) {
  const percentage = computePercentage(votes, option);
  const userVotedFor = votes?.userVote === option;
  let optionDisplayName = option;
  if (voteType === 'binary' || !voteType) {
    optionDisplayName = option === 'approve' ? 'Vote For' : 'Vote Against';
  }
  return (
    <VoteRowWrapper key={`${option}`}>
      <VoteRowContentWrapper
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleVote(option);
        }}
      >
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
                {canVote ? 'Undo vote' : 'Your vote'}
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
