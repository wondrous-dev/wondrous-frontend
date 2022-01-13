import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLazyQuery, useQuery } from '@apollo/client'

import { useMe, withAuth } from '../../../components/Auth/withAuth'
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_SUBMISSIONS,
  GET_ORG_TASK_BOARD_TASKS,
} from '../../../graphql/queries/taskBoard'
import Boards from '../../../components/organization/boards/boards'
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
import { GET_ORG_ID_FROM_USERNAME } from '../../../graphql/queries/org'
import { OrgBoardContext } from '../../../utils/contexts'
import { GET_USER_PERMISSION_CONTEXT } from '../../../graphql/queries'

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

const BoardsPage = () => {
  const [columns, setColumns] = useState(COLUMNS)
  const [statuses, setStatuses] = useState(DEFAULT_STATUS_ARR)
  const [profileOrgId, setProfileOrgId] = useState(null)
  const router = useRouter()
  const { username, orgId } = router.query
  const { data: userPermissionsContext } = useQuery(
    GET_USER_PERMISSION_CONTEXT,
    {
      fetchPolicy: 'cache-and-network',
    }
  )

  const [getOrgTaskProposals] = useLazyQuery(GET_ORG_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const newColumns = [...columns]
      const taskProposals = data?.getOrgTaskBoardProposals
      newColumns[0].section.tasks = []
      taskProposals.forEach((taskProposal) => {
        newColumns[0].section.tasks.push(taskProposal)
      })
      setColumns(newColumns)
    },
  })

  const [getOrgTaskSubmissions] = useLazyQuery(GET_ORG_TASK_BOARD_SUBMISSIONS, {
    onCompleted: (data) => {
      const newColumns = [...columns]
      const taskSubmissions = data?.getOrgTaskBoardSubmissions
      newColumns[1].section.tasks = []
      taskSubmissions?.forEach((taskSubmission) => {
        newColumns[1].section.tasks.push(taskSubmission)
      })
      setColumns(newColumns)
    },
  })

  const [getOrgTasks] = useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      // Parse task board data
      const newColumns = [...columns]
      const tasks = data?.getOrgTaskBoardTasks
      newColumns[0].tasks = []
      newColumns[1].tasks = []
      newColumns[2].tasks = []
      tasks.forEach((task) => {
        if (task?.status === TASK_STATUS_TODO) {
          newColumns[0].tasks.push(task)
        } else if (task?.status === TASK_STATUS_REQUESTED) {
          newColumns[0].section.tasks.push(task)
        } else if (task?.status === TASK_STATUS_IN_PROGRESS) {
          newColumns[1].tasks.push(task)
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
    getOrgIdFromUsername,
    { data: getOrgIdFromUsernameData, error: getOrgIdFromUsernameError },
  ] = useLazyQuery(GET_ORG_ID_FROM_USERNAME, {
    onCompleted: (data) => {
      if (data?.getOrgIdFromUsername?.orgId) {
        setProfileOrgId(data?.getOrgIdFromUsername?.orgId)
      }
    },
  })

  useEffect(() => {
    if (orgId) {
      // get user task board tasks immediately
      getOrgTasks({
        variables: {
          orgId,
          statuses,
          offset: 0,
          limit: 10,
        },
      })
    } else if (!orgId && username) {
      // Get orgId from username
      getOrgIdFromUsername({
        variables: {
          username,
        },
      })
    }
    if (!orgId && profileOrgId) {
      // fetch user task boards after getting orgId from username
      getOrgTasks({
        variables: {
          orgId: profileOrgId,
          statuses,
          offset: 0,
          limit: 10,
        },
      })
      getOrgTaskProposals({
        variables: {
          orgId: profileOrgId,
          statuses,
          offset: 0,
          limit: 3,
        },
      })
      getOrgTaskSubmissions({
        variables: {
          orgId: profileOrgId,
          statuses,
          offset: 0,
          limit: 3,
        },
      })
    }
  }, [
    username,
    orgId,
    profileOrgId,
    getOrgTasks,
    statuses,
    getOrgIdFromUsername,
    getOrgTaskSubmissions,
    getOrgTaskProposals,
  ])

  return (
    <>
      <OrgBoardContext.Provider
        value={{
          statuses,
          setStatuses,
          columns,
          setColumns,
          orgId: profileOrgId,
          userPermissionsContext:
            userPermissionsContext?.getUserPermissionContext
              ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
              : null,
        }}
      >
        <Boards selectOptions={SELECT_OPTIONS} columns={columns} />
      </OrgBoardContext.Provider>
    </>
  )
}

//export default withAuth(BoardsPage)
export default withAuth(BoardsPage)
