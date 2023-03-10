import React, { MutableRefObject, useContext, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { createPortal } from 'react-dom';

import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { TokenGatingTextfieldInput } from 'components/Settings/TokenGating/styles';
import {
  CREATE_OTTERSPACE_ACCESS_CONDITION_FOR_ORG,
  UPDATE_OTTERSPACE_ACCESS_CONDITION,
} from 'graphql/mutations/tokenGating';

import Button from 'components/Button';
import DropdownSelect from 'components/Common/DropdownSelect';
import SmartLink from 'components/Common/SmartLink';
import CustomField from 'components/Settings/TokenGating/FormField/CustomField';

import { GET_ORG_OTTERSPACE, GET_TOKEN_GATING_CONDITIONS_FOR_ORG, GET_OTTERSPACE_RAFTS } from 'graphql/queries';
import useOtterspace from 'services/otterspace';
import palette from 'theme/palette';
import { OtterspaceAccessCondition, TokenGatingCondition } from 'types/TokenGating';
import { useTokenGatingCondition } from 'utils/hooks';
import { convertIPFSUrl } from 'utils/helpers';

type Props = {
  orgId: string;
  footerRef: MutableRefObject<HTMLDivElement>;
};

const OtterspaceConfigForm = ({ orgId, footerRef }: Props) => {
  const { closeTokenGatingModal, selectedTokenGatingCondition } = useTokenGatingCondition();
  const { otterspaceAccessCondition } = (selectedTokenGatingCondition || {}) as TokenGatingCondition & {
    otterspaceAccessCondition: OtterspaceAccessCondition;
  };
  const [name, setName] = useState<string>(selectedTokenGatingCondition?.name);
  const [connectedRaft, setConnectedRaft] = useState(null);
  const [availableBadges, setAvailableBadges] = useState([]);
  const [badgeSpecId, setBadgeSpecId] = useState<string>(otterspaceAccessCondition?.badgeSpecId);
  const [creationError, setCreationError] = useState(null);
  const { getRaftInfo, getRaftWithSpecs } = useOtterspace();
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const selectedBadge = availableBadges?.find((badge) => badge.value === badgeSpecId);
  useEffect(() => {
    if (connectedRaft && selectedBadge) {
      setName(`Community: ${connectedRaft?.metadata?.name}, Badge: ${selectedBadge?.label}`);
    }
  }, [selectedBadge, connectedRaft]);

  const [getOrgOtterspace, { error: getOrgOtterspaceError }] = useLazyQuery(GET_ORG_OTTERSPACE, {
    onCompleted: async (data) => {
      const raftId = data?.getOrgOtterspace?.raftId;

      if (raftId) {
        const { raft } = await getRaftInfo(raftId);
        const { raft: raftWithSpecs } = await getRaftWithSpecs(raftId);
        setConnectedRaft(raft);
        const badgeSpecs = raftWithSpecs?.specs;
        const badgeOptions = badgeSpecs?.map((badge) => ({
          value: badge?.id,
          label: badge?.metadata?.name,
          image: badge?.metadata?.image,
        }));
        setAvailableBadges(badgeOptions);
      }
    },
    fetchPolicy: 'network-only',
    variables: { orgId },
  });

  useEffect(() => {
    getOrgOtterspace();
  }, []);

  const [createOtterspaceAccessConditionForOrg, { loading: creating }] = useMutation(
    CREATE_OTTERSPACE_ACCESS_CONDITION_FOR_ORG,
    {
      onCompleted: () => {
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage('Token gating created successfully!');
        closeTokenGatingModal();
      },
      refetchQueries: [GET_TOKEN_GATING_CONDITIONS_FOR_ORG],
      onError: () => {
        setCreationError('Error creating token gating condition');
      },
    }
  );

  const [updateOtterspaceAccessCondition, { loading: updating }] = useMutation(UPDATE_OTTERSPACE_ACCESS_CONDITION, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Otterspace access condition update successfully!');
      closeTokenGatingModal();
    },
    refetchQueries: [GET_TOKEN_GATING_CONDITIONS_FOR_ORG],
    onError: () => {
      setCreationError('Error updating otterspace access condition');
    },
  });

  if (getOrgOtterspaceError) {
    return (
      <Typography color="white" sx={{ a: { color: palette.highlightBlue } }}>
        <SmartLink href={`/organization/settings/${orgId}/integrations`} asLink>
          Set up
        </SmartLink>{' '}
        integration with Otterspace
      </Typography>
    );
  }

  if (!connectedRaft) {
    return (
      <Grid container alignItems="center">
        <Skeleton variant="circular" width={40} height={40} sx={{ backgroundColor: palette.grey850 }} />
        <Skeleton
          variant="text"
          width={100}
          sx={{ backgroundColor: palette.grey850, marginLeft: '15px', fontSize: '20px' }}
        />
      </Grid>
    );
  }

  const saveOtterspace = () => {
    const variables = {
      tokenGatingConditionId: selectedTokenGatingCondition?.id,
      input: {
        name,
        orgId,
        raftId: connectedRaft?.id,
        badgeSpecId
      },
    };

    if (selectedTokenGatingCondition?.id) {
      updateOtterspaceAccessCondition({ variables });
    } else {
      createOtterspaceAccessConditionForOrg({ variables });
    }
  };
  return (
    <Box>
      <Grid container alignItems="center" mb="20px">
        <Avatar src={convertIPFSUrl(connectedRaft?.metadata?.image)} variant="square" />
        <Typography ml="15px" color="white">
          {connectedRaft?.metadata?.name}
        </Typography>
      </Grid>

      <CustomField label="Badge">
        <DropdownSelect
          value={badgeSpecId}
          options={availableBadges}
          setValue={(id) => setBadgeSpecId(String(id))}
          innerStyle={{
            marginTop: 0,
          }}
          formSelectStyle={{
            height: 'auto',
          }}
        />
      </CustomField>

      <CustomField label="Name">
        <TokenGatingTextfieldInput value={name} />
      </CustomField>

      {creationError ? <Typography color={palette.red400}>{creationError}</Typography> : null}

      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={closeTokenGatingModal}>
                Cancel
              </Button>

              <Button onClick={saveOtterspace} type="button" disabled={!(badgeSpecId && name) || creating || updating}>
                {selectedTokenGatingCondition ? 'Update' : 'Create'} Otterspace Token Gate
              </Button>
            </Grid>,
            footerRef.current
          )
        : null}
    </Box>
  );
};

export default OtterspaceConfigForm;
