import { useState } from 'react';
import { MilestonesContainer } from './styles';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { delQuery } from 'utils';
import { useLocation } from 'utils/useLocation';
import { TaskViewModal } from '../Task/modal';
import { ColumnsContext } from 'utils/contexts';
import { Table } from 'components/Table';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import Board from './Board';
import { ViewType } from 'types/common';

type Props = {
  columns: Array<any>;
  onLoadMore: any;
  hasMore: any;
  isAdmin?: boolean;
  setColumns: React.Dispatch<React.SetStateAction<{}>>;
  activeView?: string;
};

let windowOffset = 0;
export default function MilestonesBoard({
  columns = [],
  onLoadMore = () => {},
  hasMore,
  setColumns,
  activeView,
}: Props) {
  const router = useRouter();
  const [ref, inView] = useInView({});
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);

  const handleCardClick = (milestone) => {
    const newUrl = `${delQuery(router.asPath)}?task=${milestone?.id}&view=${router.query.view || 'grid'}`;
    location.push(newUrl);
    windowOffset = window.scrollY;
    document.body.setAttribute('style', `position: fixed; top: -${windowOffset}px; left:0; right:0`);
  };
  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore]);

  useEffect(() => {
    const params = location.params;
    if (params.task || params.taskProposal) {
      setOpenModal(true);
    }
  }, [location]);

  const handleModalClose = () => {
    const style = document.body.getAttribute('style');
    const top = style.match(/(?<=top: -)(.*?)(?=px)/);
    document.body.setAttribute('style', '');
    if (top?.length > 0) {
      window?.scrollTo(0, Number(top[0]));
    }
    const newUrl = `${delQuery(router.asPath)}?view=${location?.params?.view || 'grid'}`;
    location.push(newUrl);
    setOpenModal(false);
  };

  return (
    <>
      <ColumnsContext.Provider value={{ columns, setColumns }}>
        <MilestonesContainer isFullWidth={activeView === ViewType.List}>
          <TaskViewModal
            disableEnforceFocus
            open={openModal}
            shouldFocusAfterRender={false}
            handleClose={handleModalClose}
            taskId={(location?.params?.task || location?.params?.taskProposal)?.toString()}
            isTaskProposal={!!location?.params?.taskProposal}
          />
          {activeView === ViewType.Grid ? (
            <Board milestones={columns} handleCardClick={handleCardClick} />
          ) : (
            <Table tasks={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
          )}
        </MilestonesContainer>
      </ColumnsContext.Provider>
      <LoadMore ref={ref} hasMore={hasMore}></LoadMore>
    </>
  );
}
