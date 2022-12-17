import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { ViewType } from 'types/common';
import { useTaskActions } from 'utils/hooks';
import { ENTITIES_TYPES } from 'utils/constants';
import ListView from 'components/ListView';
import { CardsContainer } from './styles';

export default function withCardsLayout(WrappedBoard, numberOfColumns = 3) {
  return function Wrapper({
    columns = [],
    onLoadMore = () => {},
    hasMore,
    activeView,
    entityType = ENTITIES_TYPES.TASK,
  }) {
    const [ref, inView] = useInView({});
    const { openTaskViewModal } = useTaskActions();

    useEffect(() => {
      if (inView && hasMore && activeView !== ViewType.List) {
        onLoadMore();
      }
    }, [inView, hasMore, onLoadMore, activeView]);

    return (
      <>
        <CardsContainer numberOfColumns={numberOfColumns} isFullWidth={activeView === ViewType.List}>
          {activeView === ViewType.Grid ? (
            <WrappedBoard tasks={columns} handleCardClick={openTaskViewModal} />
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
