import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { delQuery } from 'utils';
import { useLocation } from 'utils/useLocation';
import TaskViewModal from 'components/Common/TaskViewModal';
import Table from 'components/Table';
import { ViewType } from 'types/common';
import { ENTITIES_TYPES } from 'utils/constants';
import ListView from 'components/ListView';
import { CardsContainer } from './styles';

let windowOffset = 0;

export default function withCardsLayout(WrappedBoard, numberOfColumns = 3) {
  return function Wrapper({
    columns = [],
    onLoadMore = () => {},
    hasMore,
    activeView,
    entityType = ENTITIES_TYPES.TASK,
    ...rest
  }) {
    const router = useRouter();
    const [ref, inView] = useInView({});
    const location = useLocation();
    const [openModal, setOpenModal] = useState(false);

    const handleCardClick = (task, query = '') => {
      let newUrl = `${delQuery(router.asPath)}?task=${task?.id}&view=${router.query.view || 'grid'}&entity=${
        location?.params?.entity || ENTITIES_TYPES.TASK
      }`;
      if (query) {
        newUrl += query;
      }
      location.push(newUrl);
      windowOffset = window.scrollY;
      document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
    };
    useEffect(() => {
      if (inView && hasMore && activeView !== ViewType.List) {
        onLoadMore();
      }
    }, [inView, hasMore, onLoadMore, activeView]);

    useEffect(() => {
      const { params } = location;
      if (params.task || params.taskProposal) {
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
      const newUrl = `${delQuery(router.asPath)}?view=${location?.params?.view || 'grid'}&entity=${
        location?.params?.entity || ENTITIES_TYPES.TASK
      }`;
      location.push(newUrl);
      setOpenModal(false);
    };

    return (
      <>
        <CardsContainer numberOfColumns={numberOfColumns} isFullWidth={activeView === ViewType.List}>
          <TaskViewModal
            disableEnforceFocus
            open={openModal}
            shouldFocusAfterRender={false}
            handleClose={handleModalClose}
            taskId={(location?.params?.task || location?.params?.taskProposal)?.toString()}
            isTaskProposal={!!location?.params?.taskProposal}
          />
          {activeView === ViewType.Grid ? (
            <Suspense>
              <WrappedBoard tasks={columns} handleCardClick={handleCardClick} />
            </Suspense>
          ) : (
            <ListView
              enableInfiniteLoading
              entityType={entityType}
              singleColumnData
              columns={columns}
              onLoadMore={onLoadMore}
              hasMore={hasMore}
            />
          )}
        </CardsContainer>
        <LoadMore ref={ref} hasMore={hasMore} />
      </>
    );
  };
}
