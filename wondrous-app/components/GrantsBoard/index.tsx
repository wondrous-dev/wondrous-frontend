import { useQuery } from '@apollo/client';
import { CardsContainer } from 'components/Common/Boards/styles';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import GrantsFilters from 'components/GrantsFilters';
import ViewGrant from 'components/ViewGrant';
import { GET_ORG_GRANTS, GET_POD_GRANTS } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { LIMIT } from 'services/board';
import { GRANTS_STATUSES } from 'utils/constants';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { delQuery } from 'utils/index';
import { useLocation } from 'utils/useLocation';
import GrantsBoardCard from './Card';

const GrantsBoard = () => {
  const [activeFilter, setActiveFilter] = useState(GRANTS_STATUSES.OPEN);
  const [hasMore, setHasMore] = useState(false);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const [ref, inView] = useInView({});

  const {
    data: orgData,
    refetch: orgRefetch,
    fetchMore: orgFetchMore,
    previousData: orgPreviousData,
  } = useQuery(GET_ORG_GRANTS, {
    variables: {
      orgId: orgBoard?.orgId,
      status: activeFilter,
      limit: LIMIT,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !orgBoard?.orgId || podBoard,
    onCompleted: (data) => {
      const hasMoreData = data?.getGrantOrgBoard?.length >= LIMIT;
      if (!orgPreviousData && hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
  });

  const {
    data: podData,
    refetch: podGrantsRefetch,
    fetchMore: podGrantsFetchMore,
    previousData: podPreviousData,
  } = useQuery(GET_POD_GRANTS, {
    variables: {
      orgId: podBoard?.orgId,
      podId: podBoard?.podId,
      status: activeFilter,
      limit: LIMIT,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !podBoard && !podBoard?.podId && !podBoard?.orgId,
    onCompleted: (data) => {
      const hasMoreData = data?.getGrantPodBoard?.length >= LIMIT;
      if (!podPreviousData && hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
  });

  const data = podBoard ? podData?.getGrantPodBoard : orgData?.getGrantOrgBoard;

  const fetchMore = () =>
    podBoard
      ? podGrantsFetchMore({
          variables: {
            offset: podData?.getGrantPodBoard?.length,
          },
        }).then(({ data }) => setHasMore(data?.getGrantPodBoard?.length >= LIMIT))
      : orgFetchMore({
          variables: {
            offset: orgData?.getGrantOrgBoard?.length,
          },
        }).then(({ data }) => setHasMore(data?.getGrantOrgBoard?.length >= LIMIT));

  useEffect(() => {
    if (inView && hasMore) {
      fetchMore();
    }
  }, [inView, hasMore]);

  const handleRefetch = (variables) =>
    podBoard
      ? podGrantsRefetch(variables).then(({ data }) => setHasMore(data?.getGrantPodBoard?.length >= LIMIT))
      : orgRefetch(variables).then(({ data }) => setHasMore(data?.getGrantOrgBoard?.length >= LIMIT));

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    handleRefetch({
      status: filter,
      limit: LIMIT,
      offset: 0,
    });
  };

  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const handleCardClick = (grant, query = '') => {
    let newUrl = `${delQuery(router.asPath)}?grant=${grant?.id}`;
    if (query) {
      newUrl += query;
    }
    location.push(newUrl);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };

  useEffect(() => {
    const { params } = location;
    if (params.grant) {
      setOpenModal(true);
    }
  }, [location]);

  const handleModalClose = () => {
    const style = document.body.getAttribute('style');
    const top = style.match(/(top: -)(.*?)(?=px)/);
    document.body.setAttribute('style', '');
    if (top?.length > 0) {
      window?.scrollTo(0, Number(top[2]));
    }
    const newUrl = `${delQuery(router.asPath)}`;
    location.push(newUrl);
    setOpenModal(false);
  };

  const existingGrant = useMemo(() => {
    if (openModal && location?.params?.grant) {
      return data?.find((grant) => grant?.id === location?.params?.grant);
    }
  }, [openModal, location?.params?.grant, data]);

  return (
    <>
      <ViewGrant
        existingGrant={existingGrant}
        open={openModal}
        handleClose={handleModalClose}
        grantId={location?.params?.grant}
        isEdit={!!location?.params?.edit}
      />
      <GrantsFilters onFilterChange={handleFilterChange} activeFilter={activeFilter} />
      <CardsContainer numberOfColumns={2} isFullWidth={false}>
        {data?.map((grant, idx) => (
          <GrantsBoardCard grant={grant} handleCardClick={handleCardClick} key={grant.id} />
        ))}
      </CardsContainer>
      <LoadMore ref={ref} hasMore={hasMore} />
    </>
  );
};

export default GrantsBoard;
