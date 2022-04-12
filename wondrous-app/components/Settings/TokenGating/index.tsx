import ErrorFieldIcon from 'components/Icons/errorField.svg';
import Ethereum from 'components/Icons/ethereum';
import PolygonIcon from 'components/Icons/polygonMaticLogo.svg';
import React, { useEffect, useState } from 'react';
import { SettingsWrapper } from '../settingsWrapper';
import {
  TokenGatingHeader,
  TokenGatingDescription,
  TokenGatingWrapper,
  TokenGatingElementWrapper,
  TokenGatingSubHeader,
  NewTokenGatingButton,
} from './styles';
import TokenGatingConditionList from './TokenGatingConditionList';
import TokenGatingConfigForm from './TokenGatingConfigForm';

const chainOptions = [
  {
    label: 'Ethereum',
    icon: <Ethereum />,
    value: 'ethereum',
  },
  {
    label: 'Polygon',
    icon: <PolygonIcon />,
    value: 'polygon',
  },
];

const SUPPORTED_ACCESS_CONDITION_TYPES = [
  {
    label: 'ERC20',
    value: 'ERC20',
  },
  {
    label: 'ERC721',
    value: 'ERC721',
  },
];

const TokenGatingSettings = (props) => {
  const { orgId } = props;
  const [showConfigModal, setShowConfigModal] = useState(null);
  console.log('showConfigModal', showConfigModal);
  return (
    <SettingsWrapper>
      <TokenGatingWrapper>
        <TokenGatingHeader>Token gating</TokenGatingHeader>
        <TokenGatingElementWrapper>
          <TokenGatingSubHeader>Create New</TokenGatingSubHeader>
          <TokenGatingDescription>
            Define token gates by specifying acess criteria for different levels of the org. Go to the roles settings
            page to apply them to a role.
          </TokenGatingDescription>
          <NewTokenGatingButton onClick={() => setShowConfigModal(true)}>new token gate </NewTokenGatingButton>
        </TokenGatingElementWrapper>
        <TokenGatingConfigForm orgId={orgId} open={showConfigModal} setShowConfigModal={setShowConfigModal} />
        <TokenGatingConditionList orgId={orgId} />
      </TokenGatingWrapper>
    </SettingsWrapper>
  );
};

export default TokenGatingSettings;
