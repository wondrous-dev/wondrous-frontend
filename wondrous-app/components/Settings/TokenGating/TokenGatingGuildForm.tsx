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
import { CREATE_GUILD_ACCESS_CONDITION_FOR_ORG, UPDATE_TOKEN_GATING_CONDITION } from 'graphql/mutations/tokenGating';
import Button from 'components/Button';
import DropdownSelect from 'components/Common/DropdownSelect';
import SmartLink from 'components/Common/SmartLink';
import CustomField from 'components/FormField/CustomField';

import { GET_ORG_GUILD, GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries';
import useGuildXyz from 'services/guildxyz';
import palette from 'theme/palette';
import { GuildAccessCondition, TokenGatingCondition } from 'types/TokenGating';
import { useTokenGatingCondition } from 'utils/hooks';

type Props = {
  orgId: string;
  footerRef: MutableRefObject<HTMLDivElement>;
};

const TokenGatingGuildForm = ({ orgId, footerRef }: Props) => {
  const { closeTokenGatingModal, selectedTokenGatingCondition } = useTokenGatingCondition();
  const { accessCondition } = (selectedTokenGatingCondition || {}) as TokenGatingCondition & {
    accessCondition: GuildAccessCondition;
  };
  const [name, setName] = useState<string>(selectedTokenGatingCondition?.name);
  const [roleId, setRoleId] = useState<string>(accessCondition?.roleId);
  const [guild, setGuild] = useState(null);
  const [creationError, setCreationError] = useState(null);
  const { getGuildById } = useGuildXyz();
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const [getOrgGuild, { error: getOrgGuildError }] = useLazyQuery(GET_ORG_GUILD, {
    onCompleted: async (data) => {
      const id = data?.getOrgGuild?.guildId;

      if (id) {
        const guildById = await getGuildById(id);
        // get guild info for all guilds that and address joined
        setGuild(guildById);
        setRoleId(String(guildById.roles[0]?.id));
      }
    },
    fetchPolicy: 'network-only',
    variables: { orgId },
  });

  useEffect(() => {
    if (accessCondition?.guildId) {
      getGuildById(accessCondition?.guildId).then((guildById) => setGuild(guildById));
    } else {
      getOrgGuild();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessCondition?.guildId]);

  const [createGuildAccessConditionForOrg, { loading: creating }] = useMutation(CREATE_GUILD_ACCESS_CONDITION_FOR_ORG, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Token gating created successfully!');
      closeTokenGatingModal();
    },
    refetchQueries: [GET_TOKEN_GATING_CONDITIONS_FOR_ORG],
    onError: () => {
      setCreationError('Error creating token gating condition');
    },
  });

  const [updateTokenGatingCondition, { loading: updating }] = useMutation(UPDATE_TOKEN_GATING_CONDITION, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Token gating update successfully!');
      closeTokenGatingModal();
    },
    refetchQueries: [GET_TOKEN_GATING_CONDITIONS_FOR_ORG],
    onError: () => {
      setCreationError('Error updating token gating condition');
    },
  });

  const rolesOptions = useMemo(() => guild?.roles.map((role) => ({ value: role.id, label: role.name })), [guild]);

  if (getOrgGuildError) {
    return (
      <Typography color="white" sx={{ a: { color: palette.highlightBlue } }}>
        <SmartLink href={`/organization/settings/${orgId}/integrations`} asLink>
          Set up
        </SmartLink>{' '}
        integration with Guild.xyz
      </Typography>
    );
  }

  if (!guild) {
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

  const handleCreateGuild = () => {
    createGuildAccessConditionForOrg({
      variables: {
        input: {
          name,
          roleId,
          orgId,
          guildId: String(guild.id),
        },
      },
    });
  };

  const handleUpdateGuild = () => {
    updateTokenGatingCondition({
      variables: {
        tokenGatingConditionId: selectedTokenGatingCondition?.id,
        input: {
          name,
          accessCondition: {
            roleId,
            guildId: String(guild.id),
          },
        },
      },
    });
  };

  return (
    <Box>
      <Grid container alignItems="center" mb="20px">
        <Avatar src={guild.imageUrl} variant="square" />
        <Typography ml="15px" color="white">
          {guild?.name}
        </Typography>
      </Grid>

      <CustomField label="Role">
        <DropdownSelect
          value={roleId}
          options={rolesOptions}
          setValue={(id) => setRoleId(String(id))}
          innerStyle={{
            marginTop: 0,
          }}
          formSelectStyle={{
            height: 'auto',
          }}
        />
      </CustomField>

      <CustomField label="Name">
        <TokenGatingTextfieldInput value={name} onChange={(e) => setName(e.target.value)} />
      </CustomField>

      {creationError ? <Typography color={palette.red400}>{creationError}</Typography> : null}

      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={closeTokenGatingModal}>
                Cancel
              </Button>

              {selectedTokenGatingCondition ? (
                <Button onClick={handleUpdateGuild} type="button" disabled={!(roleId && name) || updating}>
                  Update Guild
                </Button>
              ) : (
                <Button onClick={handleCreateGuild} type="button" disabled={!(roleId && name) || creating}>
                  Create Guild
                </Button>
              )}
            </Grid>,
            footerRef.current
          )
        : null}
    </Box>
  );
};

export default TokenGatingGuildForm;
