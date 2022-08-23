import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';

import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries/tokenGating';
import { useWonderWeb3 } from 'services/web3';
import UserCheckIcon from '../../Icons/userCheckIcon';
import { HeaderBlock } from '../headerBlock';
import { ErrorText } from '../../Common';
import TokenGatingConditionDisplay from './TokenGatingConditionDisplay';

interface TokenGatingCondition {
  id: string;
  booleanLogic?: string;
  name?: string;
  orgId?: string;
  accessCondition: [AccessCondition];
}

interface AccessCondition {
  chain: string;
  contractAddress: string;
  method: string;
  minValue: string;
  tokenIds?: string;
  type: string;
}

function TokenGatingConditionList(props) {
  const router = useRouter();
  const wonderWeb3 = useWonderWeb3();
  const { orgId } = props;
  const [tokenGatingConditions, setTokenGatingConditions] = useState([]);
  const [getTokenGatingConditionsForOrg, { data, loading, fetchMore }] = useLazyQuery(
    GET_TOKEN_GATING_CONDITIONS_FOR_ORG,
    {
      onCompleted: (data) => {
        setTokenGatingConditions(data?.getTokenGatingConditionsForOrg);
      },
      fetchPolicy: 'network-only',
    }
  );
  useEffect(() => {
    if (orgId) {
      getTokenGatingConditionsForOrg({
        variables: {
          orgId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  return (
    <div>
      {tokenGatingConditions.map((tokenGatingCondition) => (
        <TokenGatingConditionDisplay key={tokenGatingCondition.id} tokenGatingCondition={tokenGatingCondition} />
      ))}
    </div>
  );
}

export default TokenGatingConditionList;
