import React, {useMemo, useState} from "react";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

import {TASK_STATUS_DONE, TASK_STATUS_INPROGRESS, TASK_STATUS_TODO} from "../../../utils/constants";

import TaskColumn from "./TaskColumn/taskColumn";
import {ITaskCard} from "./TaskCard/taskCard";
import { KanbanBoardContainer } from "./styles";

const TO_DO_CARDS_LIST: Array<ITaskCard> = [
  {
    id: 1,
    authorAvatar: '/images/boards/people.png',
    likes: 30,
    shares: 13,
    comments: 18,
    title: 'Create twitter analytics template',
    text: 'Design google sheet where we can get an open look at our twitters performance ✨🦄',
    status: TASK_STATUS_TODO,
    starCount: 2500,
    media: {
      type: 'audio',
      url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
    }
  },
  {
    id: 2,
    authorAvatar: '/images/boards/avatar.png',
    likes: 43,
    shares: 11,
    comments: 8,
    title: 'Create twitter analytics template',
    text: 'Design google sheet where we can get an open look at our twitters performance ✨🦄',
    status: TASK_STATUS_TODO,
    starCount: 1200,
    media: {
      type: 'image',
      url: '/images/boards/space.png',
    }
  },
];

const INPROGRESS_CARDS_LIST: Array<ITaskCard> = [
  {
    id: 1,
    authorAvatar: '/images/boards/avatar.png',
    likes: 144,
    shares: 52,
    comments: 81,
    title: 'Create twitter analytics template',
    text: 'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
    status: TASK_STATUS_INPROGRESS,
    starCount: 3100,
    media: {
      type: 'image',
      url: '/images/boards/space.png',
    }
  },
  {
    id: 2,
    authorAvatar: '/images/boards/people.png',
    likes: 144,
    shares: 52,
    comments: 81,
    title: 'Create twitter analytics template',
    text: 'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
    status: TASK_STATUS_INPROGRESS,
    starCount: 2100,
    media: {
      type: 'video',
      url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs',
    }
  },
];

const DONE_CARDS_LIST: Array<ITaskCard> = [
  {
    id: 1,
    authorAvatar: '/images/boards/avatarNFT.png',
    likes: 14,
    shares: 12,
    comments: 8,
    title: 'Get 10,000 Twitter followers',
    text: 'Design google sheet where we can get an open look at our twitters performance ✨🦄 ',
    status: TASK_STATUS_DONE,
    starCount: 2600,
    media: {
      type: 'video',
      url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs',
    }
  },
  {
    id: 2,
    authorAvatar: '/images/boards/people.png',
    likes: 17,
    shares: 5,
    comments: 181,
    title: 'Create twitter analytics template',
    text: 'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
    status: TASK_STATUS_DONE,
    starCount: 2400,
    media: {
      type: 'audio',
      url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
    }
  },
];

const CARDS_LIST = [
  ...TO_DO_CARDS_LIST,
  ...INPROGRESS_CARDS_LIST,
  ...DONE_CARDS_LIST,
]

const KanbanBoard = () => {
  const [statusCards, setStatusCards] = useState(CARDS_LIST);

  const {
    [TASK_STATUS_TODO]: toDoCardsList,
    [TASK_STATUS_INPROGRESS]: inProgressCardsList,
    [TASK_STATUS_DONE]: doneCardsList,
  } = useMemo(() => {
    return (
      statusCards.reduce((acc, item) => {
        const { status } = item

        return ({
          ...acc,
          [status]: [...acc[status], item]
        })

      }, {
        [TASK_STATUS_TODO]: [],
        [TASK_STATUS_INPROGRESS]: [],
        [TASK_STATUS_DONE]: [],
      })
    )
  }, [statusCards])

  const handleMoveCard = (dragStatus, hoverStatus) => {
    setStatusCards((prevState) => (
      prevState.map((item) => {
        const { status } = item

        if (status === hoverStatus) {
          return ({
            ...item,
            status: dragStatus
          })
        }

        if (status === dragStatus) {
          return ({
            ...item,
            status: hoverStatus
          })
        }

        return item
      })
    ))
  }

  return (
    <KanbanBoardContainer>
      <DndProvider backend={HTML5Backend}>
        <TaskColumn
          cardsList={toDoCardsList}
          moveCard={handleMoveCard}
          status={TASK_STATUS_TODO}
        />
        <TaskColumn
          cardsList={inProgressCardsList}
          moveCard={handleMoveCard}
          status={TASK_STATUS_INPROGRESS}
        />
        <TaskColumn
          cardsList={doneCardsList}
          moveCard={handleMoveCard}
          status={TASK_STATUS_DONE}
        />
      </DndProvider>
    </KanbanBoardContainer>
  )
}

export default KanbanBoard