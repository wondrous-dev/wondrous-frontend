
import snapshot from '@snapshot-labs/snapshot.js'

import {
  Proposal,
  Space,
  Vote
} from './types'

export const isValidSpace = (space: Space): any => (
  snapshot.utils.validateSchema(
    snapshot.schemas.space,
    space
  )
);

export const isValidProposal = (proposal: Proposal): any => (
  snapshot.utils.validateSchema(
    snapshot.schemas.proposal,
    proposal
  )
);

export const isValidVote = (vote: Vote): any => (
  snapshot.utils.validateSchema(
    snapshot.schemas.vote,
    vote
  )
);