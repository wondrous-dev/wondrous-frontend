import ErrorFieldIcon from 'components/Icons/errorField.svg';
import Ethereum from 'components/Icons/ethereum';
import PolygonIcon from 'components/Icons/polygonMaticLogo.svg';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ORG_BY_ID } from 'graphql/queries/org';
import { EditTokenGatingConditionContext } from 'utils/contexts';
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

function TokenGatingSettings(props) {
  const { orgId } = props;
  const [showConfigModal, setShowConfigModal] = useState(null);
  const [selectedTokenGatingCondition, setSelectedTokenGatingCondition] = useState(null);

  const { data: orgData } = useQuery(GET_ORG_BY_ID, {
    variables: {
      orgId,
    },
  });
  const org = orgData?.getOrgById;

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
          <NewTokenGatingButton onClick={() => setShowConfigModal(true)}>New Token gate </NewTokenGatingButton>
        </TokenGatingElementWrapper>
        <EditTokenGatingConditionContext.Provider
          value={{
            setSelectedTokenGatingCondition,
            setShowConfigModal,
          }}
        >
          <TokenGatingConfigForm
            org={org}
            orgId={orgId}
            open={showConfigModal}
            setShowConfigModal={setShowConfigModal}
            selectedTokenGatingCondition={selectedTokenGatingCondition}
            setSelectedTokenGatingCondition={setSelectedTokenGatingCondition}
          />
          <TokenGatingConditionList org={org} orgId={orgId} />
        </EditTokenGatingConditionContext.Provider>
      </TokenGatingWrapper>
    </SettingsWrapper>
  );
}

export default TokenGatingSettings;
