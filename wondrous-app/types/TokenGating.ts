import { TOKEN_GATING_CONDITION_TYPE } from 'utils/constants';

export interface AccessCondition {
  __typename: 'AccessConditionModel';
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
  __typename: 'GuildAccessCondition';
}

export interface TokenGatingCondition {
  __typename: string;
  id: string;
  orgId: string;
  podId?: any;
  name: string;
  booleanLogic?: any;
  type: TOKEN_GATING_CONDITION_TYPE;
  accessCondition: AccessCondition | GuildAccessCondition;
}
