import { useRouter } from 'next/router';
import { useContext } from 'react';
import ConnectionContext from './ConnectionContext';
import FooterButtons from './FooterButtons';

const DiscordFooter = () => {
  const router = useRouter();
  const { podId, orgId, onClose, data } = useContext(ConnectionContext);
  const { isActive } = data;
  if (isActive) return null;
  const handleClick = () => {
    if (podId) {
      router.push(`/pod/settings/${podId}/notifications`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/organization/settings/${orgId}/notifications`, undefined, {
        shallow: true,
      });
    }
  };

  return <FooterButtons onClose={onClose} action={handleClick} title="Connect Discord" />;
};

export default DiscordFooter;
