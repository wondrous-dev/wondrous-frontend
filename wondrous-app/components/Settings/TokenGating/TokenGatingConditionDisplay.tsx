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

import {
  TokenGatingNameHeader,
  TokenGatingElementWrapper,
  TokenGateActionMenu,
  TokenGateListDiv,
  TokenGateListItemDiv,
  TokenGatingHeaderLabel,
} from './styles';
import { White } from 'theme/colors';

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

import axios from 'axios';

async function getTokenInfoByAddress(chain, address) {
  // look at https://github.com/trustwallet/assets/tree/master/blockchains for list of possible chains
  const url = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${address}/info.json`;
  let info;
  try {
    info = await axios.get(url);
  } catch (e) {
    console.error(e);
    return;
  }
  return info.data;
}

function getTokenLogoURLByAddress(chain, address) {
  // look at https://github.com/trustwallet/assets/tree/master/blockchains for list of possible chains
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${address}/logo.png`;
}
const HARD_CODED_ADDRESS_TO_NAME = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'DAI',
  '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f': 'GTC',
  '0xbd3531da5cf5857e7cfaa92426877b022e612cf8': 'Pudgy Penguin',
  '0x5180db8f5c931aae63c74266b211f580155ecac8': 'Crypto Coven'
}

const TokenGatingConditionDisplay = (props) => {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [tokenName, setTokenName] = useState(null);
  const wonderWeb3 = useWonderWeb3();
  const { tokenGatingCondition } = props;
  const dropdownItemStyle = {
    marginRight: '12px',
    color: White,
  };
  const contractAddress = tokenGatingCondition?.accessCondition[0].contractAddress;

  useEffect(() => {
    const getTokenInfo = async () => {
      const hardCodedName = HARD_CODED_ADDRESS_TO_NAME[contractAddress]
      if (hardCodedName) {
        setTokenName(hardCodedName);
        return
      }
      const info = await getTokenInfoByAddress(tokenGatingCondition?.accessCondition[0].chain, contractAddress);
      setTokenName(info?.name);
    };

    getTokenInfo();
  }, [tokenGatingCondition?.accessCondition[0].contractAddress]);

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
      <TokenGateListDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Chain:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>
            <span
              style={{
                textTransform: 'capitalize',
              }}
            >
              {tokenGatingCondition?.accessCondition[0].chain}
            </span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Token:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>
            <span>{tokenName? tokenName: tokenGatingCondition?.accessCondition[0].contractAddress}</span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Min. amount to hold:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>{tokenGatingCondition?.accessCondition[0].minValue}</TokenGatingNameHeader>
        </TokenGateListItemDiv>
      </TokenGateListDiv>
    </TokenGatingElementWrapper>
  );
};

export default TokenGatingConditionDisplay;
