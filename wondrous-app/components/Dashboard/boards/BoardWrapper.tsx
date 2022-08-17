import { useRouter } from 'next/router';
import Tabs from 'components/organization/tabs/tabs';
import { USER_BOARD_PAGE_TYPES, ORG_MEMBERSHIP_REQUESTS } from 'utils/constants';
import { BoardsActivityWrapper, Wrapper } from 'components/Dashboard/boards/styles';
import BoardsActivity from 'components/Common/BoardsActivity';
import { ViewType } from 'types/common';

const BoardWrapper = ({ children, isAdmin, onSearch, filterSchema, onFilterChange, statuses, podIds }) => {
  const router = useRouter();
  const handleOnToggle = () => {
    !router.asPath.includes('admin')
      ? router.replace(`/dashboard/admin?boardType=${ORG_MEMBERSHIP_REQUESTS}`)
      : router.replace(`/dashboard`);
  };

  const toggleItems = [
    {
      label: 'Contributor',
      isActive: !router.asPath.includes(ViewType.Admin),
      onChange: handleOnToggle,
    },
    {
      label: 'Admin',
      isActive: router.asPath.includes(ViewType.Admin),
      onChange: handleOnToggle,
    },
  ];

  const pageType = isAdmin ? USER_BOARD_PAGE_TYPES.ADMIN : USER_BOARD_PAGE_TYPES.CONTRIBUTOR;
  return (
    <Wrapper>
      <Tabs page={pageType} withQueries={isAdmin}>
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
