import { useEffect, useMemo, useState } from 'react';
import GrantsFilters from 'components/GrantsFilters';
import { GRANTS_STATUSES } from 'utils/constants';
import {
  CardsContainer,
} from 'components/Common/Boards/styles';
import ViewGrant from 'components/ViewGrant';
import { useLocation } from 'utils/useLocation';
import { useRouter } from 'next/router';
import { delQuery } from 'utils/index';
import { GET_ORG_GRANTS } from 'graphql/queries';
import { useQuery } from '@apollo/client';
import { useOrgBoard } from 'utils/hooks';
import { LIMIT } from 'services/board';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { useInView } from 'react-intersection-observer';
import GrantsBoardCard from './Card';

const GrantsBoard = () => {
  const [activeFilter, setActiveFilter] = useState(GRANTS_STATUSES.OPEN);
  const [hasMore, setHasMore] = useState(false);
  const orgBoard = useOrgBoard();
  const [ref, inView] = useInView({});

  const { data, refetch, fetchMore, previousData } = useQuery(GET_ORG_GRANTS, {
    variables: {
      orgId: orgBoard?.orgId,
      status: activeFilter,
      limit: LIMIT,
      offset: 0,
    },
    onCompleted: (data) => {
      const hasMoreData = data?.getGrantOrgBoard?.length >= LIMIT;
      if (!previousData && hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
    skip: !orgBoard?.orgId,
  });
  useEffect(() => {
    if (inView && hasMore) {
      fetchMore({
        variables: {
          offset: data?.getGrantOrgBoard?.length,
        },
      }).then(({ data }) => setHasMore(data?.getGrantOrgBoard?.length >= LIMIT));
    }
  }, [inView, hasMore]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    refetch({
      status: filter,
      limit: LIMIT,
      offset: 0,
    }).then(({ data }) => setHasMore(data?.getGrantOrgBoard?.length >= LIMIT));
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
    if(openModal && location?.params?.grant) {
      return data?.getGrantOrgBoard?.find((grant) => grant?.id === location?.params?.grant);
    }
  }, [openModal, location?.params?.grant, data?.getGrantOrgBoard])

  return (
    <>
      <ViewGrant existingGrant={existingGrant} open={openModal} handleClose={handleModalClose} grantId={location?.params?.grant} isEdit={!!location?.params?.edit}/>
      <GrantsFilters onFilterChange={handleFilterChange} activeFilter={activeFilter} />
      <CardsContainer numberOfColumns={2} isFullWidth={false}>
        {data?.getGrantOrgBoard?.map((grant, idx) => (
          <GrantsBoardCard grant={grant} handleCardClick={handleCardClick} key={grant.id} />
        ))}
      </CardsContainer>
      <LoadMore ref={ref} hasMore={hasMore} />
    </>
  );
};

export default GrantsBoard;
