import { withAuth } from 'components/Auth/withAuth';
import CoordinapePage from 'components/AppInstallation/Coordinape';

const Coordinape = () => <CoordinapePage />;

export default withAuth(Coordinape);
