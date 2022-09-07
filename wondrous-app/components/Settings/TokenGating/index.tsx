import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { DELETE_TOKEN_GATING_CONDITION } from 'graphql/mutations/tokenGating';
import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries';
import React, { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { GET_ORG_BY_ID } from 'graphql/queries/org';
import SettingsWrapper from 'components/Common/SidebarSettings';
import { TokenGatingCondition } from 'types/TokenGating';
import { TokenGatingContext } from 'utils/contexts';
import Button from 'components/Button';
import palette from 'theme/palette';

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
        <Box width="100%" height="100%">
          <Typography variant="h2" fontSize="28px" color="white">
            Token Gating
          </Typography>

          <Box
            sx={{
              background: palette.black90,
            }}
            p="24px"
            my="24px"
            borderRadius="6px"
          >
            <Typography variant="h2" fontSize="20px" color={palette.blue20}>
              Create New
            </Typography>

            <Typography fontSize="14px" color={palette.grey250}>
              Define token gates by specifying acess criteria for different levels of the org. Go to the roles settings
              page to apply them to a role.
            </Typography>

            <Box display="flex" mt="20px">
              <Button fullWidth={false} onClick={() => setOpenTokenGatingModal(true)}>
                New Token gate
              </Button>
            </Box>
          </Box>
        </Box>

        {openTokenGatingModal ? <TokenGatingModal org={org} orgId={orgId} open={openTokenGatingModal} /> : null}

        <TokenGatingConditionList orgId={orgId} />
      </TokenGatingContext.Provider>
    </SettingsWrapper>
  );
}

export default TokenGatingSettings;
