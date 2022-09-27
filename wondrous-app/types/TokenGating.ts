import { TOKEN_GATING_CONDITION_TYPE } from 'utils/constants';

export interface AccessCondition {
  contractAddress: string;
  type: string;
  chain: string;
  method: string;
  minValue: string;
  tokenIds?: any;
}

export interface GuildAccessCondition {
  guildId: string;
  roleId: string;
}

export interface TokenGatingCondition {
  __typename: string;
  id: string;
  orgId: string;
  podId?: any;
  name: string;
  booleanLogic?: any;
  type: TOKEN_GATING_CONDITION_TYPE;
  tokenAccessCondition: AccessCondition;
  guildAccessCondition: GuildAccessCondition;
}
