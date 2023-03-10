import { useLazyQuery, useMutation } from '@apollo/client';
import { ErrorText } from 'components/Common';
import DropdownSelect from 'components/Common/DropdownSelect';
import { StyledLink, StyledNextLink } from 'components/Common/text';
import {
  IntegrationsHelperText,
  IntegrationsInputsBlock,
  IntegrationsSnapshotENSInput,
  IntegrationsSnapshotInputSubBlock,
  IntegrationsSnapshotSubBlock,
} from 'components/Settings/Integrations/styles';
import { LabelBlock } from 'components/Settings/styles';
import { DISCONNECT_GUILD_FROM_ORG } from 'graphql/mutations';
import { GET_ORG_GUILD } from 'graphql/queries';
import { useContext, useEffect, useState } from 'react';
import useGuildXyz from 'services/guildxyz';
import { useWonderWeb3 } from 'services/web3';
import ConnectionContext from '../Integrations/Helpers/ConnectionContext';

export default function GuildIntegration() {
  const { orgId, data, setData, podId } = useContext(ConnectionContext);
  const { connectedGuild = null, selectedGuildId = null } = data;
  const [orgGuildQueryRan, setOrgGuildQueryRan] = useState(false); // indicate if query was completed
  const [noGuildsJoinedError, setNoGuildsJoinedError] = useState(null);
  const [guildOptions, setGuildOptions] = useState([]);
  const wonderWeb3 = useWonderWeb3();

  const connectWeb3 = async () => {
    await wonderWeb3.onConnect();
  };

  const { getGuildsJoinedByAddress, getGuildsByIds, getGuildById } = useGuildXyz();

  const getAvailableGuildInfo = async (address: string) => {
    // get guild info for all guilds that and address joined
    const guildsAndRoles = await getGuildsJoinedByAddress(address);
    const guildIds = guildsAndRoles?.map((data) => data.guildId);
    if (!guildIds || guildIds.length === 0) {
      setNoGuildsJoinedError('no guilds joined');
      return;
    }
    const guildsInfo = await getGuildsByIds(guildIds);
    const joinedGuilds = [];
    guildsInfo.map((guildInfo) => {
      joinedGuilds.push({ value: guildInfo.id, label: guildInfo.name });
    });
    setGuildOptions(joinedGuilds);
  };

  const [disconnectGuildFromOrg] = useMutation(DISCONNECT_GUILD_FROM_ORG, { refetchQueries: [GET_ORG_GUILD] });

  const [getOrgGuild] = useLazyQuery(GET_ORG_GUILD, {
    onCompleted: (data) => {
      const guildId = data?.getOrgGuild?.guildId;

      getGuildById(guildId)
        .then((data) => {
          setData((prev) => ({ ...prev, connectedGuild: data }));
        })
        .catch((err) => {
          console.error('error getting guild info', err);
          setData((prev) => ({ ...prev, connectedGuild: null }));
        });
      setData((prev) => ({ ...prev, connectedGuild: guildId }));
      setOrgGuildQueryRan(true);
    },
    onError: () => {
      setData((prev) => ({ ...prev, connectedGuild: null }));
      setOrgGuildQueryRan(true);
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    connectWeb3();
  }, []);

  useEffect(() => {
    setNoGuildsJoinedError(null);
    if (orgGuildQueryRan && !connectedGuild && wonderWeb3.address) {
      setGuildOptions([]);
      getAvailableGuildInfo(wonderWeb3.address);
    }
  }, [wonderWeb3.address, orgGuildQueryRan]);

  useEffect(() => {
    if (orgId) {
      getOrgGuild({ variables: { orgId } });
    }
  }, [orgId]);
  useEffect(() => {}, []);
  const handleGuildDisconnect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!connectedGuild) return;
    disconnectGuildFromOrg({
      variables: {
        orgId,
        guildId: connectedGuild,
      },
    });
  };
  return (
    <IntegrationsInputsBlock>
      <LabelBlock>Guild.xyz Config</LabelBlock>
      {connectedGuild && (
        <div>
          <IntegrationsHelperText>Connected Guild:</IntegrationsHelperText>
          <IntegrationsSnapshotSubBlock>
            <IntegrationsSnapshotInputSubBlock>
              <IntegrationsSnapshotENSInput value={connectedGuild?.name} />
            </IntegrationsSnapshotInputSubBlock>
            <StyledLink onClick={handleGuildDisconnect}>Disconnect Guild</StyledLink>
          </IntegrationsSnapshotSubBlock>
        </div>
      )}
      {!connectedGuild && (
        <div>
          <IntegrationsHelperText>Guilds you are in</IntegrationsHelperText>
          <IntegrationsSnapshotSubBlock>
            <DropdownSelect
              value={selectedGuildId}
              options={guildOptions}
              setValue={(value) => setData((prev) => ({ ...prev, selectedGuildId: value }))}
              formSelectStyle={{
                height: 'auto',
                width: '100%',
                maxWidth: '100%',
              }}
              innerStyle={{
                marginTop: '0',
                background: '#272729',
              }}
            />
            {/* <IntegrationsConnectButton onClick={handleGuildConnect}>Connect Guild</IntegrationsConnectButton> */}
          </IntegrationsSnapshotSubBlock>
          {noGuildsJoinedError && (
            <ErrorText>
              {' '}
              you have not joined guilds! Go to{' '}
              <a href="https://guild.xyz/" target="-blank">
                guild.xyz
              </a>{' '}
              to join a guild{' '}
            </ErrorText>
          )}
        </div>
      )}
      <StyledNextLink href={`/organization/settings/${orgId}/token-gating`}>Set up Guild role gating</StyledNextLink>
    </IntegrationsInputsBlock>
  );
}
