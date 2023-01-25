import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';

import CalendarBoard from 'components/Common/CalendarBoard';
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

    if (activeView === ViewType.Calendar) {
      return <CalendarBoard />;
    }

    if (activeView === ViewType.List) {
      return (
        <ListView
          enableInfiniteLoading
          entityType={entityType}
          singleColumnData
          columns={columns}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
        />
      );
    }

    return (
      <>
        <CardsContainer numberOfColumns={numberOfColumns} isFullWidth={false}>
          <WrappedBoard tasks={columns} handleCardClick={handleCardClick} />
        </CardsContainer>
        <LoadMore ref={ref} hasMore={hasMore} />
      </>
    );
  };
}
