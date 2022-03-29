import React, { useEffect, useState } from 'react';
import { InputAdornment } from '@material-ui/core';
import { useRouter } from 'next/router';

import SearchIcon from '../../Icons/search';
import Wrapper from '../wrapper/wrapper';

import KanbanBoard from '../../Common/KanbanBoard/kanbanBoard';
import { ButtonGroup } from '../../Common/ButtonGroup';

import { BoardsActivity, BoardsActivityInput, BoardsContainer } from './styles';

import { Table } from '../../Table';
import { ToDo, InProgress, Done } from '../../Icons';
import CreatePodIcon from '../../Icons/createPod';
import Filter from '../../Common/Filter';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { delQuery } from '../../../utils';

// NOTE: commenting for now because it's not used and it's causing a build error

// enum ViewType {
//   List = 'list',
//   Grid = 'grid',
// }

// const Boards = (props) => {
//   const { selectOptions, columns, tasks, onLoadMore, hasMore } = props;
//   const [selected, setSelected] = useState(0);
//   const buttons = ['List', 'Grid'];
//   const router = useRouter();
//   const [view, setView] = useState(null);

//   useEffect(() => {
//     if (router.isReady) {
//       setView((router.query.view || ViewType.Grid) as ViewType);
//     }
//   }, [router.query.view]);

//   const [filter, setFilter] = useState([]);
//   const filterSchema = [
//     {
//       name: 'Pods',
//       multiChoice: true,
//       items: [
//         { id: 'designPod', name: 'Design Pod', icon: <CreatePodIcon />, count: 12 },
//         { id: 'growthTeam', name: 'Growth Team', icon: <CreatePodIcon />, count: 4 },
//         { id: 'analytics', name: 'Analytics', icon: <CreatePodIcon />, count: 1 },
//         { id: 'dataPod', name: 'Data Pod', icon: <CreatePodIcon />, count: 0 },
//         { id: 'prDreamTeam', name: 'PR Dream Team', icon: <CreatePodIcon />, count: 2 },
//         { id: 'twitterPod', name: 'Twitter Pod', icon: <CreatePodIcon />, count: 10 },
//         { id: 'blogPod', name: 'Blog Pod', icon: <CreatePodIcon />, count: 2 },
//       ],
//     },
//     {
//       name: 'Status',
//       multiChoice: false,
//       items: [
//         { id: 'membershipRequests', name: 'Membership requests', icon: <Done />, count: 4 },
//         { id: 'proposals', name: 'Proposals', icon: <Done />, count: 22 },
//         { id: 'toDo', name: 'To-Do', icon: <ToDo />, count: 8 },
//         { id: 'inProgress', name: 'In Progress', icon: <InProgress />, count: 232 },
//         { id: 'inReview', name: 'In Review', icon: <Done />, count: 324 },
//         { id: 'awaitingPayment', name: 'Awaiting Payment', icon: <Done />, count: 340 },
//         { id: 'completed', name: 'Completed', icon: <Done />, count: 1120 },
//       ],
//     },
//   ];

//   const listViewOptions = [
//     {
//       name: 'List',
//       active: view === ViewType.List,
//       action: () => {
//         router.replace(`${delQuery(router.asPath)}?view=${ViewType.List}`);
//       },
//     },
//     {
//       name: 'Grid',
//       active: view === ViewType.Grid,
//       action: () => {
//         router.replace(`${delQuery(router.asPath)}?view=${ViewType.Grid}`);
//       },
//     },
//   ];

//   return (
//     <Wrapper>
//       <BoardsContainer>
//         <BoardsActivity>
//           <BoardsActivityInput
//             style={{ visibility: 'hidden' }}
//             placeholder="Search people or pods..."
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           {/*<Filter style={{ visibility: 'hidden' }} filterSchema={filterSchema} filter={filter} setFilter={setFilter} />*/}
//           {view ? <ToggleViewButton options={listViewOptions} /> : null}
//         </BoardsActivity>

//         {view ? (
//           <>
//             {view === ViewType.Grid ? (
//               <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
//             ) : (
//               <Table columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
//             )}
//           </>
//         ) : null}
//       </BoardsContainer>
//     </Wrapper>
//   );
// };

export default Boards;
