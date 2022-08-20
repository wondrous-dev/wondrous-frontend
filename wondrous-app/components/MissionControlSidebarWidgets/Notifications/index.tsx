import Accordion from 'components/Common/Accordion';
import NotificationsBoard from 'components/Notifications';
import { useNotifications } from 'utils/hooks';
import { NotificationsWrapper } from './styles';

const Notifications = () => {
  const { unreadCount, markAllNotificationsRead } = useNotifications();
  return (
    <Accordion title="Notifications" defaultExpanded>
      <NotificationsWrapper>
        <NotificationsBoard onlyBoard />
      </NotificationsWrapper>
    </Accordion>
  );
};

export default Notifications;
