import LeaderboardWrapper from 'components/Leaderboard/LeaderboardWrapper';
import BoardPageHeader from '../wrapper/BoardPageHeader';

function Analytics(props) {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  return (
    <BoardPageHeader orgData={orgData} headerTitle="Analytics">
      <LeaderboardWrapper orgId={orgId} orgData={orgData} />
    </BoardPageHeader>
  );
}

export default Analytics;
