import React, { MutableRefObject, useMemo, useState } from 'react';
import Button from 'components/Button';
import DropdownSelect from 'components/Common/DropdownSelect';
import SmartLink from 'components/Common/SmartLink';
import CustomField from 'components/FormField/CustomField';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { createPortal } from 'react-dom';

import { GET_ORG_GUILD } from 'graphql/queries';
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
  const [role, setRole] = useState(null);
  const { getGuildById } = useGuildXyz();

  const { error } = useQuery(GET_ORG_GUILD, {
    onCompleted: async (data) => {
      const guildId = data?.getOrgGuild?.guildId;

      if (guildId) {
        const guildById = await getGuildById(guildId);
        // get guild info for all guilds that and address joined
        setGuild(guildById);
        setRole(guildById.roles[0]?.id);
      }
    },
    fetchPolicy: 'network-only',
    variables: { orgId: org.id },
  });

  const rolesOptions = useMemo(() => guild?.roles.map((role) => ({ value: role.id, label: role.name })), [guild]);

  if (error) {
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
          value={role}
          options={rolesOptions}
          setValue={setRole}
          innerStyle={{
            marginTop: 0,
          }}
          formSelectStyle={{
            height: 'auto',
          }}
        />
      </CustomField>

      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onClose}>Create Guild</Button>
            </Grid>,
            footerRef.current
          )
        : null}
    </Box>
  );
};

export default TokenGatingGuild;
