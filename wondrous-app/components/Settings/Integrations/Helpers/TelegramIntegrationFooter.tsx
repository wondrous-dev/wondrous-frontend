import { useContext } from 'react';
import ConnectionContext from './ConnectionContext';
import FooterButtons from './FooterButtons';

const TelegramIntegrationFooter = () => {
  const { onClose, data } = useContext(ConnectionContext);

  const handleOnClick = () => window.open('https://t.me/wonderverse_bot', '_blank');
  return <FooterButtons title="Connect Telegram" onClose={onClose} action={handleOnClick} />;
};

export default TelegramIntegrationFooter;
