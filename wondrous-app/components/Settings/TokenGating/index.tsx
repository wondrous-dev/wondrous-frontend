import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { DELETE_TOKEN_GATING_CONDITION } from 'graphql/mutations/tokenGating';
import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries';
import React, { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
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
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const setSnackbarAlertSeverity = snackbarContext?.setSnackbarAlertSeverity;

  const [openTokenGatingModal, setOpenTokenGatingModal] = useState(null);
  const [selectedTokenGatingCondition, setSelectedTokenGatingCondition] = useState(null);
  const [getOrgById, { data: { getOrgById: org } = { getOrgById: {} } }] = useLazyQuery(GET_ORG_BY_ID);
  const [deleteTokenGatingCondition] = useMutation(DELETE_TOKEN_GATING_CONDITION, {
    refetchQueries: [GET_TOKEN_GATING_CONDITIONS_FOR_ORG],
    onError: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertSeverity('error');
      setSnackbarAlertMessage('There are roles associated with this condition!');
    },
  });

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

  const deleteTokenGating = (tokenGatingCondition: TokenGatingCondition) => {
    deleteTokenGatingCondition({
      variables: {
        tokenGatingConditionId: tokenGatingCondition?.id,
      },
    });
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
          deleteTokenGating,
          selectedTokenGatingCondition,
        }}
      >
        <TokenGatingWrapper>
          <TokenGatingHeader>Token gating</TokenGatingHeader>
          <TokenGatingElementWrapper>
            <TokenGatingSubHeader>Create New</TokenGatingSubHeader>
            <TokenGatingDescription>
              Define token gates by specifying access criteria for different levels of the org. Go to the roles settings
              page to apply them to a role.
            </TokenGatingDescription>
            <NewTokenGatingButton onClick={() => setOpenTokenGatingModal(true)}>New Token gate </NewTokenGatingButton>
          </TokenGatingElementWrapper>
          {openTokenGatingModal ? <TokenGatingModal org={org} orgId={orgId} open={openTokenGatingModal} /> : null}

          <TokenGatingConditionList orgId={orgId} />
        </TokenGatingWrapper>
      </TokenGatingContext.Provider>
    </SettingsWrapper>
  );
}

export default TokenGatingSettings;
