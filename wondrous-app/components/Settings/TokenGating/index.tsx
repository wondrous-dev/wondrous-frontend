import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_ORG_BY_ID } from 'graphql/queries/org';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { TokenGatingCondition } from 'types/TokenGating';
import { TokenGatingContext } from 'utils/contexts';
import {
  TokenGatingHeader,
  TokenGatingDescription,
  TokenGatingWrapper,
  TokenGatingElementWrapper,
  TokenGatingSubHeader,
  NewTokenGatingButton,
} from './styles';
import TokenGatingConditionList from './TokenGatingConditionList';
import TokenGatingModal from './TokenGatingModal';

type Props = {
  orgId: string;
};

function TokenGatingSettings({ orgId }: Props) {
  const [openTokenGatingModal, setOpenTokenGatingModal] = useState(null);
  const [selectedTokenGatingCondition, setSelectedTokenGatingCondition] = useState(null);

  const [getOrgById, { data: { getOrgById: org } = { getOrgById: {} } }] = useLazyQuery(GET_ORG_BY_ID);

  useEffect(() => {
    if (orgId) {
      getOrgById({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId, getOrgById]);

  const closeTokenGatingModal = () => {
    setOpenTokenGatingModal(false);
    setSelectedTokenGatingCondition(null);
  };

  const editTokenGating = (tokenGatingCondition: TokenGatingCondition) => {
    setOpenTokenGatingModal(true);
    setSelectedTokenGatingCondition(tokenGatingCondition);
  };

  return (
    <SettingsWrapper>
      <TokenGatingContext.Provider
        value={{
          editTokenGating,
          closeTokenGatingModal,
          selectedTokenGatingCondition,
        }}
      >
        <TokenGatingWrapper>
          <TokenGatingHeader>Token gating</TokenGatingHeader>
          <TokenGatingElementWrapper>
            <TokenGatingSubHeader>Create New</TokenGatingSubHeader>
            <TokenGatingDescription>
              Define token gates by specifying acess criteria for different levels of the org. Go to the roles settings
              page to apply them to a role.
            </TokenGatingDescription>
            <NewTokenGatingButton onClick={() => setOpenTokenGatingModal(true)}>New Token gate </NewTokenGatingButton>
          </TokenGatingElementWrapper>
          <TokenGatingModal org={org} orgId={orgId} open={openTokenGatingModal} />
          <TokenGatingConditionList orgId={orgId} />
        </TokenGatingWrapper>
      </TokenGatingContext.Provider>
    </SettingsWrapper>
  );
}

export default TokenGatingSettings;
