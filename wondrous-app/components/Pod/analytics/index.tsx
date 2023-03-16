import BoardPageHeader from 'components/Pod/wrapper/BoardPageHeader';
import LeaderboardWrapper from 'components/Leaderboard/LeaderboardWrapper';

function Analytics(props) {
  const { podData = {} } = props;
  const { id: podId } = podData;

  return (
    <BoardPageHeader headerTitle="Analytics">
      <LeaderboardWrapper podId={podId} />
    </BoardPageHeader>
  );
}

export default Analytics;
