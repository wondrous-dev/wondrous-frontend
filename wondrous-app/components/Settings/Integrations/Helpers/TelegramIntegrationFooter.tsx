import { useContext } from 'react';
import { getTelegramBotLink } from 'utils/index';
import * as yup from 'yup';
import { CONNECT_TELEGRAM_BOT } from 'graphql/mutations';
import { useMutation } from '@apollo/client';
import FooterButtons from './FooterButtons';
import ConnectionContext from './ConnectionContext';

const telegramGroupIdSchema = yup
  .number()
  .integer('ID must be an integer.')
  .negative('ID must be negative.')
  .required('ID is required.');

const validateTelegramGroupId = async (groupId) => {
  try {
    await telegramGroupIdSchema.validate(groupId);
    return true;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

const TelegramIntegrationFooter = () => {
  const [connectTelegram] = useMutation(CONNECT_TELEGRAM_BOT, {
    refetchQueries: ['getOrgIntegrations', 'getPodIntegrations'],
  });

  const { onClose, data, setData, orgId, podId } = useContext(ConnectionContext);
  const handleConnect = () => {
    const { tgValue } = data;
    validateTelegramGroupId(tgValue).then((isValid) => {
      if (isValid) {
        connectTelegram({ variables: { chatId: `${tgValue}`, orgId, podId } });
        onClose();
      } else {
        setData((prev) => ({ ...prev, tgError: 'Invalid Group ID' }));
      }
    });
  };

  return <FooterButtons title="Connect Telegram" onClose={onClose} action={handleConnect} />;
};

export default TelegramIntegrationFooter;
