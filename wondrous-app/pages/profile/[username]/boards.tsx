import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'

import Boards from '../../../components/profile/boards/boards'
import { GET_USER_TASK_BOARD_TASKS } from '../../../graphql/queries/taskBoard'
import { useMe } from '../../../components/Auth/withAuth'

import {
  InReview,
  Requested,
  Archived,
} from '../../../components/Icons/sections'
import {
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  TASK_STATUS_REQUESTED,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_ARCHIVED,
  DEFAULT_STATUS_ARR,
} from '../../../utils/constants'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GET_USER_ID_FROM_USERNAME } from '../../../graphql/queries'

const TO_DO = {
  status: TASK_STATUS_TODO,
  tasks: [],
  section: {
    title: 'Requests',
    icon: Requested,
    id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
    filter: {
      taskType: TASK_STATUS_REQUESTED,
    },
    expandable: true,
    action: {
      text: 'Request',
    },
    tasks: [],
  },
}

const IN_PROGRESS = {
  status: TASK_STATUS_IN_PROGRESS,
  tasks: [],
  section: {
    title: 'In Review',
    icon: InReview,
    id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
    filter: {
      taskType: TASK_STATUS_IN_REVIEW,
    },
    expandable: true,
    action: {
      text: 'Review',
    },
    tasks: [],
  },
}

const DONE = {
  status: TASK_STATUS_DONE,
  tasks: [],
  section: {
    title: 'Archived',
    icon: Archived,
    id: '337d2b80-65fd-48ca-bb17-3c0155162a62',
    filter: {
      taskType: TASK_STATUS_ARCHIVED,
    },
    expandable: true,
    action: {
      text: 'Restore',
    },
    tasks: [],
  },
}

const COLUMNS = [TO_DO, IN_PROGRESS, DONE]

const SELECT_OPTIONS = [
  '#copywriting (23)',
  '#growth (23)',
  '#design (23)',
  '#community (11)',
  '#sales (23)',
  '#tiktok (13)',
  '#analytics (23)',
]

const TASKS = [
  {
    id: 11,
    title: 'Task 1',
    description:
      'Design google sheet where we can get an open look at our twitters performance ✨🦄',
    status: TASK_STATUS_TODO,
    actions: {
      comments: 18,
      likes: 30,
      shares: 13,
    },
    compensation: {
      amount: 2500,
      currency: 'wonder',
    },
    media: [
      {
        id: 11,
        type: 'audio',
        url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
      },
      {
        id: 12,
        type: 'image',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'link',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'video',
        url: '/images/boards/space.png',
      },
      {
        id: 11,
        type: 'audio',
        url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
      },
      {
        id: 12,
        type: 'image',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'link',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'video',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'image',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'link',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'video',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'link',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'video',
        url: '/images/boards/space.png',
      },
      {
        id: 12,
        type: 'video',
        url: '/images/boards/space.png',
      },
    ],
    users: [
      {
        name: 'UserName',
        id: 'ea5232b9-1a6b-4ced-a368-f5f0139295ad',
        initials: 'LT',
        avatar: {
          id: 'e5c92eca-7218-418f-a74b-7cf4932f6a36',
          isOwnerOfPod: true,
        },
      },
      {
        name: 'AnotherUser',
        id: 'a7d1d8d5-ee35-4519-b9ec-dd42f71bea93',
        initials: 'AA',
      },
    ],
  },
  {
    id: 12,
    title: 'Task 2',
    description:
      'Design google sheet where we can get an open look at our twitters performance ✨🦄',
    status: TASK_STATUS_TODO,
    actions: {
      comments: 8,
      likes: 43,
      shares: 11,
    },
    compensation: {
      amount: 1200,
      currency: 'wonder',
    },
    media: [
      {
        id: 12,
        type: 'image',
        url: '/images/boards/space.png',
      },
    ],
    users: [
      {
        name: 'Third User',
        id: 'beafc448-5a68-4382-9aad-1de24ead8563',
        initials: 'OP',
      },
    ],
  },
  {
    id: 21,
    title: 'Task 3',
    description:
      'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
    status: TASK_STATUS_IN_PROGRESS,
    actions: {
      comments: 81,
      likes: 144,
      shares: 52,
    },
    compensation: {
      amount: 3100,
      currency: 'wonder',
    },
    media: [
      {
        id: 21,
        type: 'image',
        url: '/images/boards/space.png',
      },
    ],
    users: [
      {
        name: 'Third User',
        id: 'beac6b46-0b6b-4e23-b1b3-50492294e3e6',
        initials: 'IK',
      },
      {
        name: 'Third User',
        id: '976228a0-46da-440e-9c30-f98157ea1768',
        initials: 'ZZ',
      },
      {
        name: 'Third User',
        id: 'bf551338-b9c9-41d2-b984-6cdc1714bce6',
        initials: 'RT',
      },
    ],
  },
  {
    id: 22,
    title: 'Task 4',
    description:
      'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
    status: TASK_STATUS_IN_PROGRESS,
    actions: {
      comments: 81,
      likes: 144,
      shares: 52,
    },
    compensation: {
      amount: 2100,
      currency: 'wonder',
    },
    media: [
      {
        id: 22,
        type: 'video',
        url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs',
      },
      {
        id: 12,
        type: 'link',
        url: '/images/boards/space.png',
      },
    ],
    users: [
      {
        name: 'Third User',
        id: '0770c50c-8598-4b2a-ad75-0f58d5937e89',
        initials: 'JA',
      },
    ],
  },
  {
    id: 31,
    title: 'Get 10,000 Twitter followers',
    description:
      'Design google sheet where we can get an open look at our twitters performance ✨🦄 ',
    status: TASK_STATUS_DONE,
    actions: {
      comments: 8,
      likes: 14,
      shares: 12,
    },
    compensation: {
      amount: 2600,
      currency: 'wonder',
    },
    media: [
      {
        id: 31,
        type: 'video',
        url: 'https://www.youtube.com/watch?v=HmpP7e9gLYs',
      },
    ],
    users: [
      {
        name: 'Third User',
        id: '0770c50c-8598-4b2a-ad75-0f58d5937e89',
        initials: 'JA',
      },
      {
        name: 'AnotherUser',
        id: 'a7d1d8d5-ee35-4519-b9ec-dd42f71bea93',
        initials: 'AA',
      },
    ],
  },
  {
    id: 32,
    title: 'Task 5',
    description:
      'Maecenas hendrerit porttitor integer viverra lorem metus et in.',
    status: TASK_STATUS_DONE,
    actions: {
      comments: 181,
      likes: 17,
      shares: 5,
    },
    compensation: {
      amount: 2400,
      currency: 'wonder',
    },
    media: [
      {
        id: 32,
        type: 'audio',
        url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix',
      },
    ],
    users: [
      {
        name: 'AnotherUser',
        id: 'a7d1d8d5-ee35-4519-b9ec-dd42f71bea93',
        initials: 'AA',
      },
      {
        name: 'Third User',
        id: '0770c50c-8598-4b2a-ad75-0f58d5937e89',
        initials: 'JA',
      },
    ],
  },
]

const BoardsPage = () => {
  const [columns, setColumns] = useState(COLUMNS)
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR)
  const [profileUserId, setProfileUserId] = useState(null)
  const user = useMe()
  const router = useRouter()
  const { username, userId } = router.query

  const [
    getUserTasks,
    {
      loading: userTasksLoading,
      data: userTasksData,
      error: userTasksError,
      refetch: userTasksRefetch,
      fetchMore: userTasksFetchMore,
    },
  ] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      // Parse task board data
      const newColumns = [...COLUMNS]
      const tasks = data?.getUserTaskBoardTasks
      tasks.forEach((task) => {
        if (task?.status === TASK_STATUS_TODO) {
          newColumns[0].tasks.push(task)
        } else if (task?.status === TASK_STATUS_REQUESTED) {
          newColumns[0].section.tasks.push(task)
        } else if (task?.status === TASK_STATUS_IN_PROGRESS) {
          newColumns[1].tasks.push(task)
        } else if (task?.status === TASK_STATUS_IN_REVIEW) {
          newColumns[1].section.tasks.push(task)
        } else if (task?.status === TASK_STATUS_DONE) {
          newColumns[2].tasks.push(task)
        } else if (task?.status === TASK_STATUS_ARCHIVED) {
          newColumns[2].section.tasks.push(task)
        }
      })
      setColumns(newColumns)
    },
  })
  const [
    getUserIdFromUsername,
    { data: getUserIdFromUsernameData, error: getUserIdFromUsernameError },
  ] = useLazyQuery(GET_USER_ID_FROM_USERNAME, {
    onCompleted: (data) => {
      if (data?.getUserIdFromUsername?.userId) {
        setProfileUserId(data?.getUserIdFromUsername?.userId)
      }
    },
  })

  useEffect(() => {
    if (userId) {
      // get user task board tasks immediately
      getUserTasks({
        variables: {
          userId,
          statuses,
          offset: 0,
          limit: 10,
        },
      })
    } else if (!userId && username) {
      // Get userId from username
      getUserIdFromUsername({
        variables: {
          username,
        },
      })
    }
    if (!userId && profileUserId) {
      // fetch user task boards after getting userId from username
      getUserTasks({
        variables: {
          userId: profileUserId,
          statuses,
          offset: 0,
          limit: 10,
        },
      })
    }
  }, [
    username,
    userId,
    profileUserId,
    getUserTasks,
    statuses,
    getUserIdFromUsername,
  ])

  return (
    <Boards selectOptions={SELECT_OPTIONS} columns={columns} tasks={TASKS} />
  )
}

export default BoardsPage
