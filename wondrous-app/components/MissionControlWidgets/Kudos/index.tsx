import WidgetLayout from 'components/MissionControlWidgets/WidgetLayout';
import { EmptyStateText } from 'components/MissionControlWidgets/InProgressTasks/styles';

const KudosWidget = () => (
  <WidgetLayout title="Kudos">
    <EmptyStateText>When people send you kudos, you'll see it here</EmptyStateText>
  </WidgetLayout>
);

export default KudosWidget;
