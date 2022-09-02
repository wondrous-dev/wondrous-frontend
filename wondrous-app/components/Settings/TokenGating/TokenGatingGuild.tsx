import { CREATE_TOKEN_GATING_CONDITION_FOR_ORG } from 'graphql/mutations/tokenGating';
import React, { MutableRefObject, useMemo, useState } from 'react';
import Button from 'components/Button';
import DropdownSelect from 'components/Common/DropdownSelect';
import SmartLink from 'components/Common/SmartLink';
import CustomField from 'components/FormField/CustomField';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { createPortal } from 'react-dom';

import { GET_ORG_GUILD, GET_TOKEN_GATING_CONDITIONS_FOR_ORG } from 'graphql/queries';
import useGuildXyz from 'services/guildxyz';
import { Guild } from 'types/Guild';
import { Org } from 'types/Org';
import palette from 'theme/palette';

type Props = {
  org: Org;
  footerRef: MutableRefObject<HTMLDivElement>;
  onClose: () => void;
};

const TokenGatingGuild = ({ org, footerRef, onClose }: Props) => {
  const [guild, setGuild] = useState<Guild>(null);
  const [roleId, setRoleId] = useState(null);
  const [creationError, setCreationError] = useState(null);
  const { getGuildById } = useGuildXyz();

  const { error: getOrgGuildError } = useQuery(GET_ORG_GUILD, {
    onCompleted: async (data) => {
      const guildId = data?.getOrgGuild?.guildId;

      if (guildId) {
        const guildById = await getGuildById(guildId);
        // get guild info for all guilds that and address joined
        setGuild(guildById);
        setRoleId(guildById.roles[0]?.id);
      }
    },
    fetchPolicy: 'network-only',
    variables: { orgId: org.id },
  });

  const [createTokenGatingConditionForOrg] = useMutation(CREATE_TOKEN_GATING_CONDITION_FOR_ORG, {
    onCompleted: (data) => {
      debugger;
      // clearErrors();
      // clearSelection();
      // onClose();
    },
    refetchQueries: [GET_TOKEN_GATING_CONDITIONS_FOR_ORG],
    onError: (error: ApolloError) => {
      setCreationError('Error creating token gating condition');
    },
  });

  const rolesOptions = useMemo(() => guild?.roles.map((role) => ({ value: role.id, label: role.name })), [guild]);

  if (getOrgGuildError) {
    return (
      <Typography color="white" sx={{ a: { color: palette.highlightBlue } }}>
        <SmartLink href={`/organization/settings/${org.id}/integrations`} asLink>
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
    if (!roleId) {
      return;
    }

    createTokenGatingConditionForOrg({
      variables: {
        input: {
          orgId: org.id,
          name: 'test',
          accessCondition: {
            roleId: String(roleId),
            orgId: org.id,
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
          setValue={setRoleId}
          innerStyle={{
            marginTop: 0,
          }}
          formSelectStyle={{
            height: 'auto',
          }}
        />
      </CustomField>

      {creationError ? <Typography color={palette.red400}>{creationError}</Typography> : null}

      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleCreateGuild} disabled={!roleId}>
                Create Guild
              </Button>
            </Grid>,
            footerRef.current
          )
        : null}
    </Box>
  );
};

export default TokenGatingGuild;
