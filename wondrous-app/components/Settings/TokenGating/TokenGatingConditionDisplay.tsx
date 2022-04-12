import React, { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { HeaderBlock } from '../headerBlock';

import { Button, CircularProgress } from '@material-ui/core';
import UserCheckIcon from '../../Icons/userCheckIcon';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries/tokenGating';
import { useWonderWeb3 } from 'services/web3';
import { ErrorText } from '../../Common';
import Accordion from '../../Common/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import { DropDown, DropDownItem } from '../../Common/dropdown';
import { TaskMenuIcon } from '../../Icons/taskMenu';

import { TokenGatingNameHeader, TokenGatingElementWrapper, TokenGateActionMenu } from './styles';

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

async function getTokenInfoFromEVMChain(chainId, contractAddress) {
  return {
    symbol: 'usdc',
    name: 'usdc',
    decimal: '18',
  };
}

const CHAIN_NAME_TO_CHAIN_ID = {
  ethereum: 1,
  rinkeby: 4,
  polygon: 137,
};

const DropDownArrowButton = () => {
  return <Button></Button>;
};
const TokenGatingConditionDisplay = (props) => {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const wonderWeb3 = useWonderWeb3();
  const { tokenGatingCondition } = props;
  const dropdownItemStyle = {
    marginRight: '12px',
  };

  return (
    <TokenGatingElementWrapper>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenGatingNameHeader>{tokenGatingCondition.name}</TokenGatingNameHeader>
        <TokenGateActionMenu right="true">
          <DropDown DropdownHandler={TaskMenuIcon}>
            <DropDownItem key={tokenGatingCondition?.id} onClick={() => {}} style={dropdownItemStyle}>
              Edit
            </DropDownItem>
            <DropDownItem key={tokenGatingCondition?.id} onClick={() => {}} style={dropdownItemStyle}>
              Activate
            </DropDownItem>
            <DropDownItem key={tokenGatingCondition?.id} onClick={() => {}} style={dropdownItemStyle}>
              Delete
            </DropDownItem>
          </DropDown>
        </TokenGateActionMenu>
      </div>
      <TokenGatingNameHeader>{tokenGatingCondition?.accessCondition[0].chain}</TokenGatingNameHeader>
      <TokenGatingNameHeader>{tokenGatingCondition?.accessCondition[0].minValue}</TokenGatingNameHeader>
      <TokenGatingNameHeader>{tokenGatingCondition?.accessCondition[0].contractAddress}</TokenGatingNameHeader>
    </TokenGatingElementWrapper>
  );
};

export default TokenGatingConditionDisplay;
