import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { ViewType } from 'types/common';
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
    const router = useRouter();
    const [ref, inView] = useInView({});

    const handleCardClick = (task) => {
      const query = {
        ...router.query,
        task: task?.id,
      };

      router.push({ query }, undefined, { scroll: false, shallow: true });
    };
    useEffect(() => {
      if (inView && hasMore && activeView !== ViewType.List) {
        onLoadMore();
      }
    }, [inView, hasMore, onLoadMore, activeView]);

    return (
      <>
        <CardsContainer numberOfColumns={numberOfColumns} isFullWidth={activeView === ViewType.List}>
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
