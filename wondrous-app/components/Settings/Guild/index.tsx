import { useRouter } from 'next/router';
import GitHubIcon from '@mui/icons-material/GitHub';
import palette from 'theme/palette';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ORG_GUILD } from 'graphql/queries';
import { CONNECT_GUILD_TO_ORG, DISCONNECT_GUILD_FROM_ORG } from 'graphql/mutations';
import {
  IntegrationsInputsBlock,
  IntegrationsHelperText,
  IntegrationsSnapshotSubBlock,
  IntegrationsSnapshotInputSubBlock,
  IntegrationsConnectButton,
  IntegrationsDisconnectButton,
  IntegrationsSnapshotENSInput,
} from 'components/Settings/Integrations/styles';
import { LabelBlock } from 'components/Settings/styles';
import { useWonderWeb3 } from 'services/web3';
import useGuildXyz from 'services/guildxyz';
import DropdownSelect from 'components/Common/DropdownSelect/dropdownSelect';
import { ErrorText } from 'components/Common';

export default function GuildIntegration({ orgId }) {
  const [selectedGuildId, setSelectedGuildId] = useState(null);
  const [connectedGuildId, setConnectedGuildId] = useState(null);
  const [orgGuildQueryRan, setOrgGuildQueryRan] = useState(false); // indicate if query was completed
  const [connectedGuild, setConnectedGuild] = useState(null);
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

  const [connectGuildToOrg] = useMutation(CONNECT_GUILD_TO_ORG, { refetchQueries: [GET_ORG_GUILD] });
  const [disconnectGuildFromOrg] = useMutation(DISCONNECT_GUILD_FROM_ORG, { refetchQueries: [GET_ORG_GUILD] });

  const [getOrgGuild] = useLazyQuery(GET_ORG_GUILD, {
    onCompleted: (data) => {
      const guildId = data?.getOrgGuild?.guildId;

      getGuildById(guildId)
        .then((data) => {
          setConnectedGuild(data);
        })
        .catch((err) => {
          console.error('error getting guild info', err);
          setConnectedGuild(null);
        });

      setConnectedGuildId(guildId);
      setOrgGuildQueryRan(true);
    },
    onError: () => {
      setConnectedGuildId(null);
      setOrgGuildQueryRan(true);
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    connectWeb3();
  }, []);

  useEffect(() => {
    setNoGuildsJoinedError(null);
    if (orgGuildQueryRan && !connectedGuildId && wonderWeb3.address) {
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
  const handleGuildConnect = () => {
    if (!selectedGuildId) return;
    if (connectedGuildId) return;
    connectGuildToOrg({
      variables: {
        orgId,
        guildId: selectedGuildId.toString(),
      },
    });
  };
  const handleGuildDisonnect = () => {
    if (!connectedGuildId) return;
    disconnectGuildFromOrg({
      variables: {
        orgId,
        guildId: connectedGuildId,
      },
    });
  };
  return (
    <IntegrationsInputsBlock>
      <LabelBlock>Guild.xyz Config</LabelBlock>
      {connectedGuildId && (
        <div>
          <IntegrationsHelperText>Connected Guild:</IntegrationsHelperText>
          <IntegrationsSnapshotSubBlock>
            <IntegrationsSnapshotInputSubBlock>
              <IntegrationsSnapshotENSInput value={connectedGuild?.name} />
            </IntegrationsSnapshotInputSubBlock>
            <IntegrationsDisconnectButton onClick={handleGuildDisonnect}>Disconnect Guild</IntegrationsDisconnectButton>
          </IntegrationsSnapshotSubBlock>
        </div>
      )}
      {!connectedGuildId && (
        <div>
          <IntegrationsHelperText>Guilds you are in</IntegrationsHelperText>
          <IntegrationsSnapshotSubBlock>
            <DropdownSelect
              value={selectedGuildId}
              options={guildOptions}
              setValue={setSelectedGuildId}
              formSelectStyle={{
                height: 'auto',
              }}
              innerStyle={{
                marginTop: '0',
                background: '#272729',
              }}
            />
            <IntegrationsConnectButton onClick={handleGuildConnect}>Connect Guild</IntegrationsConnectButton>
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
    </IntegrationsInputsBlock>
  );
}
