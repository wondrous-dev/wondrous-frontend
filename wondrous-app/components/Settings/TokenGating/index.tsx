import ErrorFieldIcon from 'components/Icons/errorField.svg';
import Ethereum from 'components/Icons/ethereum';
import PolygonIcon from 'components/Icons/polygonMaticLogo.svg';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ORG_BY_ID } from 'graphql/queries/org';
import { EditTokenGatingConditionContext } from 'utils/contexts';
import SettingsWrapper from 'components/Common/SidebarSettings';
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
