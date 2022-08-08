import { useRouter } from 'next/router';
import Tabs from 'components/organization/tabs/tabs';
import { Wrapper } from './styles';
import { BoardsActivityWrapper } from 'components/Dashboard/boards/styles';
import BoardsActivity from 'components/Common/BoardsActivity';
import { ViewType } from 'types/common';
import { delQuery } from 'utils';

const BoardWrapper = ({ children, isAdmin, onSearch, filterSchema, onFilterChange, statuses, podIds }) => {
  const router = useRouter();
  const handleOnToggle = () => {
    router.query.view !== ViewType.Admin
      ? router.replace(`${delQuery(router.asPath)}?view=${ViewType.Admin}`)
      : router.replace(`${delQuery(router.asPath)}`);
  };

  const toggleItems = [
    {
      label: 'Contributor',
      isActive: router.query.view !== ViewType.Admin,
      onChange: handleOnToggle,
    },
    {
      label: 'Admin',
      isActive: router.query.view === ViewType.Admin,
      onChange: handleOnToggle,
    },
  ];

  return (
    <Wrapper>
      <Tabs page="dashboard">
        <BoardsActivityWrapper>
          <BoardsActivity
            onSearch={onSearch}
            filterSchema={filterSchema}
            onFilterChange={onFilterChange}
            statuses={statuses}
            podIds={podIds}
            toggleItems={toggleItems}
            withAdminToggle
            isAdmin={isAdmin}
          />
        </BoardsActivityWrapper>
        {children}
      </Tabs>
    </Wrapper>
  );
};

export default BoardWrapper;
