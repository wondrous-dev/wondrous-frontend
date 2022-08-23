import Accordion from 'components/Common/Accordion';
import NotificationsBoard from 'components/Notifications';
import { NotificationsWrapper } from './styles';

const Notifications = () => (
  <Accordion title="Notifications" defaultExpanded>
    <NotificationsWrapper>
      <NotificationsBoard onlyBoard />
    </NotificationsWrapper>
  </Accordion>
);

export default Notifications;
