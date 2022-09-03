import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries/tokenGating';
import { TOKEN_GATING_CONDITION_TYPE } from 'utils/constants';
import TokenGatingConditionItem from './TokenGatingConditionItem';
import GuildConditionItem from './GuildConditionItem';

type Props = {
  orgId: string;
};

function TokenGatingConditionList({ orgId }: Props) {
  const [tokenGatingConditions, setTokenGatingConditions] = useState([]);

  const [getTokenGatingConditionsForOrg] = useLazyQuery(GET_TOKEN_GATING_CONDITIONS_FOR_ORG, {
    onCompleted: (data) => {
      setTokenGatingConditions(data?.getTokenGatingConditionsForOrg);
    },
    fetchPolicy: 'network-only',
    variables: {
      orgId,
    },
  });

  useEffect(() => {
    if (orgId) {
      getTokenGatingConditionsForOrg({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId, getTokenGatingConditionsForOrg]);

  return (
    <>
      {tokenGatingConditions.map((tokenGatingCondition) =>
        tokenGatingCondition.type === TOKEN_GATING_CONDITION_TYPE.GUILD ? (
          <GuildConditionItem key={tokenGatingCondition.id} tokenGatingCondition={tokenGatingCondition} />
        ) : (
          <TokenGatingConditionItem key={tokenGatingCondition.id} tokenGatingCondition={tokenGatingCondition} />
        )
      )}
    </>
  );
}

export default TokenGatingConditionList;
