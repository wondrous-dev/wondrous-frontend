import { useLazyQuery } from '@apollo/client'
import * as _ from 'lodash'
import { useEffect, useState } from 'react'
import { GET_TASK_FOR_MILESTONE } from '../../../graphql/queries'
import * as Constants from '../../../utils/constants'
import { AwaitingPayment, Done, InProgress, InReview, ToDo } from '../../Icons'
import { ArchivedIcon } from '../../Icons/statusIcons'
import { StyledBox, StyledBoxWrapper } from './styles'

export const TASK_ICONS_LABELS = {
    [Constants.TASK_STATUS_TODO]: { icon: ToDo, label: 'To Do' },
    [Constants.TASK_STATUS_IN_PROGRESS]: { icon: InProgress, label: 'In Progress' },
    [Constants.TASK_STATUS_IN_REVIEW]: { icon: InReview, label: 'In Review' },
    [Constants.TASK_STATUS_DONE]: { icon: Done, label: 'Done' },
    [Constants.TASK_STATUS_AWAITING_PAYMENT]: { icon: AwaitingPayment, label: 'Awaiting Payment' },
    [Constants.TASK_STATUS_ARCHIVED]: { icon: ArchivedIcon, label: 'Archived' }
}

export const MilestoneTaskBreakdown = (props) => {
    const { milestoneId, open } = props
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

    return (
        <StyledBoxWrapper>
            {Object.keys(TASK_ICONS_LABELS).map((key, index) => {
                const { icon: StatusIcon, label } = TASK_ICONS_LABELS[key]
                const tasks = groupedMilestoneTask?.[key]
                return (
                    <StyledBox key={index}><StatusIcon /> {tasks?.length || 0} {label}</StyledBox>
                )
            })}
        </StyledBoxWrapper>
    )
}