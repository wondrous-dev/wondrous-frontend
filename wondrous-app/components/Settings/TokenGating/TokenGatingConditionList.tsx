import React, { useEffect, useMemo, useState } from 'react';
import Tabs from 'components/Tabs';
import Typography from '@mui/material/Typography';
import { useLazyQuery } from '@apollo/client';

import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries/tokenGating';
import { TOKEN_GATING_CONDITION_TYPE } from 'utils/constants';
import { useTokenGatingCondition } from 'utils/hooks';
import TokenGatingItem from '../../TokenGatingItem';

type Props = {
  orgId: string;
};

function TokenGatingConditionList({ orgId }: Props) {
  const [tokenGatingConditions, setTokenGatingConditions] = useState([]);
  const { editTokenGating, deleteTokenGating } = useTokenGatingCondition();
  const [selectedTab, setSelectedTab] = useState(TOKEN_GATING_CONDITION_TYPE.TOKEN_GATE);
  console.log('tokenGatingConditions', tokenGatingConditions);
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

  const tokenGatingConditionsByType = useMemo(
    () => tokenGatingConditions.filter((r) => (r.type || TOKEN_GATING_CONDITION_TYPE.TOKEN_GATE) === selectedTab),
    [selectedTab, tokenGatingConditions]
  );

  if (!tokenGatingConditions.length) {
    return null;
  }

  return (
    <>
      <Tabs
        value={selectedTab}
        onChange={(e, tab) => setSelectedTab(tab)}
        tabs={[
          { label: 'Token gate', value: TOKEN_GATING_CONDITION_TYPE.TOKEN_GATE },
          { label: 'Guild.xyz', value: TOKEN_GATING_CONDITION_TYPE.GUILD },
          { label: 'Otterspace', value: TOKEN_GATING_CONDITION_TYPE.OTTERSPACE },
        ]}
      />

      {tokenGatingConditionsByType.length ? (
        tokenGatingConditionsByType.map((tokenGatingCondition) => (
          <TokenGatingItem
            key={tokenGatingCondition.id}
            onEdit={() => editTokenGating(tokenGatingCondition)}
            onDelete={() => deleteTokenGating(tokenGatingCondition)}
            tokenGatingCondition={tokenGatingCondition}
          />
        ))
      ) : (
        <Typography color="white">No records found</Typography>
      )}
    </>
  );
}

export default TokenGatingConditionList;
