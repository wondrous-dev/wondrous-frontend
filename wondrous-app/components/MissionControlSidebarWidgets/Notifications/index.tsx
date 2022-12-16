import Accordion from 'components/Common/Accordion';
import NotificationsBoard from 'components/Notifications';
import WidgetLayout from 'components/MissionControlWidgets/WidgetLayout';
import { NotificationsWrapper } from './styles';

const Notifications = () => (
  <WidgetLayout title="Notifications" padding="10px 0px 10px 10px">
    <NotificationsWrapper>
      <NotificationsBoard onlyBoard />
    </NotificationsWrapper>
  </WidgetLayout>
);

export default Notifications;
