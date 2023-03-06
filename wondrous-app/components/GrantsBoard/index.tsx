import { useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CardsContainer } from 'components/Common/Boards/styles';
import { BountyBoardEmpty } from 'components/Common/BountyBoard/styles';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { Button } from 'components/Button';
import { CreateFormModalOverlay } from 'components/CreateEntity/styles';
import CreateEntityDiscardTask from 'components/CreateEntityDiscardTask';
import CreateGrant from 'components/CreateGrant';
import GrantsFilters from 'components/GrantsFilters';
import ViewGrant from 'components/ViewGrant';
import { GET_ORG_GRANTS, GET_POD_GRANTS } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { LIMIT } from 'services/board';
import { ENTITIES_TYPES, GRANTS_STATUSES, PERMISSIONS } from 'utils/constants';
import { useOrgBoard, usePodBoard, useGlobalContext } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { delQuery } from 'utils/index';
import PlusIconWithBackground from 'components/Common/PlusIconWithBackground';
import GrantsBoardCard from './Card';
import EmptyGrantsBoard from './EmptyState';

const GrantsBoard = () => {
  const [activeFilter, setActiveFilter] = useState(GRANTS_STATUSES.OPEN);
  const [hasMore, setHasMore] = useState(false);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const [ref, inView] = useInView({});
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { userPermissionsContext } = useGlobalContext();
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: orgBoard?.orgId,
    podId: podBoard?.podId,
  });
  const canSeeLedger = permissions.includes(PERMISSIONS.MANAGE_GRANTS) || permissions.includes(PERMISSIONS.FULL_ACCESS);

  const {
    data: orgGrants,
    refetch: orgRefetch,
    fetchMore: orgFetchMore,
    previousData: orgPreviousData,
    loading: orgLoading,
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
    data: podGrants,
    refetch: podGrantsRefetch,
    fetchMore: podGrantsFetchMore,
    previousData: podPreviousData,
    loading: podLoading,
  } = useQuery(GET_POD_GRANTS, {
    variables: {
      podId: podBoard?.podId,
      status: activeFilter,
      limit: LIMIT,
      offset: 0,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !podBoard && !podBoard?.podId,
    onCompleted: (data) => {
      const hasMoreData = data?.getGrantPodBoard?.length >= LIMIT;
      if (!podPreviousData && hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
  });

  const data = useMemo(
    () => (podBoard ? podGrants?.getGrantPodBoard : orgGrants?.getGrantOrgBoard),
    [podBoard, podGrants, orgGrants]
  );

  const fetchMore = () =>
    podBoard
      ? podGrantsFetchMore({
          variables: {
            offset: podGrants?.getGrantPodBoard?.length,
          },
        }).then(({ data }) => setHasMore(data?.getGrantPodBoard?.length >= LIMIT))
      : orgFetchMore({
          variables: {
            offset: orgGrants?.getGrantOrgBoard?.length,
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

  const router = useRouter();

  const handleCardClick = (grant, queryParams = {}) => {
    const query = {
      ...router.query,
      ...queryParams,
      grant: grant?.id,
    };

    router.push({ query }, undefined, { scroll: false, shallow: true });
  };

  const handleModalClose = () => {
    router.push({ pathname: `${delQuery(router.asPath)}` }, undefined, { scroll: false, shallow: true });
  };

  const existingGrant = useMemo(() => {
    if (router.query?.grant) {
      return data?.find((grant) => grant?.id === router.query?.grant);
    }
  }, [router.query?.grant, data]);

  const toggleCreateFormModal = () => setIsCreateModalOpen((prev) => !prev);

  const toggleDisacrdModal = () => setIsDiscardOpen((prev) => !prev);

  const loading = orgLoading || podLoading;

  return (
    <>
      <ViewGrant
        existingGrant={existingGrant}
        open={!!router.query?.grant}
        handleClose={handleModalClose}
        grantId={router.query?.grant}
        isEdit={!!router.query?.edit}
      />
      {isCreateModalOpen ? (
        <>
          <CreateEntityDiscardTask
            open={isDiscardOpen}
            onClose={setIsDiscardOpen}
            onCloseFormModal={toggleCreateFormModal}
            entityType={ENTITIES_TYPES.GRANT}
          />

          <CreateFormModalOverlay open={isCreateModalOpen} onClose={toggleDisacrdModal}>
            <CreateGrant
              entityType={ENTITIES_TYPES.GRANT}
              handleClose={toggleCreateFormModal}
              cancel={toggleCreateFormModal}
            />
          </CreateFormModalOverlay>
        </>
      ) : null}
      <Grid display="flex" justifyContent="space-between" marginBottom={2} marginRight={2}>
        <GrantsFilters onFilterChange={handleFilterChange} activeFilter={activeFilter} />
        <div style={{ display: 'flex', gap: 12 }}>
          {canSeeLedger && (
            <Button
              buttonTheme={{
                paddingX: 16,
                paddingY: 7,
                fontSize: '14px',
                fontWeight: 500,
              }}
              color="secondary"
              onClick={() =>
                router.push({ pathname: `${delQuery(router.asPath)}/ledger` }, undefined, { shallow: true })
              }
              height={28}
            >
              Ledger
            </Button>
          )}
          <Button
            gap="5px"
            buttonTheme={{
              paddingX: 7,
              paddingY: 7,
              fontSize: '14px',
              fontWeight: 500,
            }}
            color="secondary"
            height={28}
            onClick={toggleCreateFormModal}
          >
            <PlusIconWithBackground width="20px" height="20px" /> <span> Add grant</span>
          </Button>
        </div>
      </Grid>
      <CardsContainer numberOfColumns={2} isFullWidth={false}>
        {data?.map((grant, idx) => (
          <GrantsBoardCard grant={grant} handleCardClick={handleCardClick} key={grant.id} />
        ))}
        {!data?.length && !loading ? <EmptyGrantsBoard handleCreate={toggleCreateFormModal} /> : null}
      </CardsContainer>
      <LoadMore ref={ref} hasMore={hasMore} />
    </>
  );
};

export default GrantsBoard;
