import { useContext } from 'react';
import { getTelegramBotLink } from 'utils/index';
import ConnectionContext from './ConnectionContext';
import FooterButtons from './FooterButtons';

const TelegramIntegrationFooter = () => {
  const { onClose, data } = useContext(ConnectionContext);
  const tgLink = getTelegramBotLink();
  const handleOnClick = () => window.open(tgLink, '_blank');
  return <FooterButtons title="Connect Telegram" onClose={onClose} action={handleOnClick} />;
};

export default TelegramIntegrationFooter;
