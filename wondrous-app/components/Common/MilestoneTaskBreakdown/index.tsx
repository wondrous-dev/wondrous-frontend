import { useLazyQuery } from '@apollo/client'
import * as _ from 'lodash'
<<<<<<< HEAD
import { useEffect } from 'react'
import { GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE } from '../../../graphql/queries'
=======
import { useEffect, useState } from 'react'
import { GET_TASK_FOR_MILESTONE } from '../../../graphql/queries'
>>>>>>> 0add7c0 (feat: added milestone tasks breakdown)
import * as Constants from '../../../utils/constants'
import { AwaitingPayment, Done, InProgress, InReview, ToDo } from '../../Icons'
import { ArchivedIcon } from '../../Icons/statusIcons'
import { StyledBox, StyledBoxWrapper } from './styles'

export const TASK_ICONS_LABELS = {
    [Constants.TASK_STATUS_TODO]: { icon: ToDo, label: 'To Do' },
<<<<<<< HEAD
    "inProgress": { icon: InProgress, label: 'In Progress' },
    "inReview": { icon: InReview, label: 'In Review' },
    [Constants.TASK_STATUS_DONE]: { icon: Done, label: 'Done' },
    "awaitingPayment": { icon: AwaitingPayment, label: 'Awaiting Payment' },
=======
    [Constants.TASK_STATUS_IN_PROGRESS]: { icon: InProgress, label: 'In Progress' },
    [Constants.TASK_STATUS_IN_REVIEW]: { icon: InReview, label: 'In Review' },
    [Constants.TASK_STATUS_DONE]: { icon: Done, label: 'Done' },
    [Constants.TASK_STATUS_AWAITING_PAYMENT]: { icon: AwaitingPayment, label: 'Awaiting Payment' },
>>>>>>> 0add7c0 (feat: added milestone tasks breakdown)
    [Constants.TASK_STATUS_ARCHIVED]: { icon: ArchivedIcon, label: 'Archived' }
}

export const MilestoneTaskBreakdown = (props) => {
    const { milestoneId, open } = props
<<<<<<< HEAD
    const [getPerStatusTaskCountForMilestone, { data }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE)

    useEffect(() => {
        if (open || !data) {
            getPerStatusTaskCountForMilestone({
                variables: {
                    "milestoneId": milestoneId
                }
            })
        }
    }, [getPerStatusTaskCountForMilestone, milestoneId, open, data])
=======
    const [groupedMilestoneTask, setGroupedMilestoneTask] = useState({})
    const [getTasksForMilestone] = useLazyQuery(GET_TASK_FOR_MILESTONE) // TODO: There should be an endpoint that only returns the task count for a milestone
    const limit = 1000

    useEffect(() => {
        if (open && Object.entries(groupedMilestoneTask).length === 0) {
            getTasksForMilestone({
                variables: {
                    "milestoneId": milestoneId,
                    "limit": limit,
                    "offset": 0
                }
            }).then(({ data }) => {
                setGroupedMilestoneTask(_.groupBy(data?.getTasksForMilestone, 'status'))
            }).catch((err) => {
                console.log(err)
            })
        }
    }, [getTasksForMilestone, milestoneId, open, groupedMilestoneTask])
>>>>>>> 0add7c0 (feat: added milestone tasks breakdown)

    return (
        <StyledBoxWrapper>
            {Object.keys(TASK_ICONS_LABELS).map((key, index) => {
                const { icon: StatusIcon, label } = TASK_ICONS_LABELS[key]
<<<<<<< HEAD
                const taskCount = data?.getPerStatusTaskCountForMilestone?.[key] || 0
                return (
                    <StyledBox key={index}><StatusIcon /> {taskCount} {label}</StyledBox>
=======
                const tasks = groupedMilestoneTask?.[key]
                return (
                    <StyledBox key={index}><StatusIcon /> {tasks?.length || 0} {label}</StyledBox>
>>>>>>> 0add7c0 (feat: added milestone tasks breakdown)
                )
            })}
        </StyledBoxWrapper>
    )
}