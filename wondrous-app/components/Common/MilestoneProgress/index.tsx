import {
    StyledBox,
    StyledTextWrapper,
    StyledTasksLabel,
    StyledTasksCount,
    StyledProgressBarWrapper,
    StyledProgressBar
} from "./styles"
import { GET_TASK_FOR_MILESTONE } from "../../../graphql/queries"
import { useLazyQuery } from "@apollo/client"
import { useEffect } from "react"
import { TASK_STATUS_DONE } from "../../../utils/constants"

export const MilestoneProgress = (props) => {
    const { milestoneId, color = "#396CFF" } = props
    const [getTasksForMilestone, { data: getTasksForMilestoneData }] = useLazyQuery(GET_TASK_FOR_MILESTONE) // TODO: should only get the number of tasks, not the tasks themselves
    const tasksTotal = getTasksForMilestoneData?.getTasksForMilestone?.length
    const tasksCompleted = getTasksForMilestoneData?.getTasksForMilestone?.filter(task => task.status === TASK_STATUS_DONE).length

    useEffect(() => {
        getTasksForMilestone({
            variables: {
                "milestoneId": milestoneId,
                "limit": 100,
                "offset": 0
            }
        })
    }, [getTasksForMilestone, milestoneId])

    return (
        <StyledBox>
            <StyledTextWrapper>
                <StyledTasksLabel>Tasks</StyledTasksLabel>
                <StyledTasksCount>{tasksCompleted}/{tasksTotal}</StyledTasksCount>
            </StyledTextWrapper>
            <StyledProgressBarWrapper>
                <StyledProgressBar value={tasksCompleted} total={tasksTotal} color={color} />
            </StyledProgressBarWrapper>
        </StyledBox>
    )
}
