import { useRouter } from 'next/router';
import { UserBoardContext } from 'utils/contexts';
import BoardWrapper from 'components/Dashboard/boards/BoardWrapper';
import BountyBoard from 'components/Common/BountyBoard';
const BountiesDashboard = ({ isAdmin }) => {
  return (
    <UserBoardContext.Provider value={{}}>
      <BoardWrapper
        isAdmin
        onSearch={() => {}}
        filterSchema={[]}
        onFilterChange={() => {}}
        statuses={[]}
        podIds={() => {}}
      >
        <BountyBoard tasks={[]} handleCardClick={() => {}} />
      </BoardWrapper>
    </UserBoardContext.Provider>
  );
};

export default BountiesDashboard;
