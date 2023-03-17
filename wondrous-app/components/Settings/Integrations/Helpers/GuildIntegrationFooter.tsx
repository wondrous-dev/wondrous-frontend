import { useMutation } from '@apollo/client';
import { CONNECT_GUILD_TO_ORG } from 'graphql/mutations';
import { useContext } from 'react';
import ConnectionContext from './ConnectionContext';
import FooterButtons from './FooterButtons';

const GuildIntegrationFooter = () => {
  const [connectGuildToOrg] = useMutation(CONNECT_GUILD_TO_ORG, { refetchQueries: ['getOrgGuild'] });

  const { data, setData, orgId, podId, onClose } = useContext(ConnectionContext);
  const { connectedGuildId, selectedGuildId } = data;

  const title = connectedGuildId || !selectedGuildId ? '' : 'Connect guild';

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

  return <FooterButtons onClose={onClose} action={handleGuildConnect} title={title} />;
};

export default GuildIntegrationFooter;
