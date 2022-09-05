import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries/tokenGating';
import { useTokenGatingCondition } from 'utils/hooks';
import TokenGatingItem from '../../TokenGatingItem';

type Props = {
  orgId: string;
};

function TokenGatingConditionList({ orgId}: Props) {
  const [tokenGatingConditions, setTokenGatingConditions] = useState([]);
  const { editTokenGating, deleteTokenGating } = useTokenGatingCondition();

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
      {tokenGatingConditions.map((tokenGatingCondition) => (
        <TokenGatingItem
          key={tokenGatingCondition.id}
          onEdit={() => editTokenGating(tokenGatingCondition)}
          onDelete={() => deleteTokenGating(tokenGatingCondition)}
          tokenGatingCondition={tokenGatingCondition}
        />
      ))}
    </>
  );
}

export default TokenGatingConditionList;
