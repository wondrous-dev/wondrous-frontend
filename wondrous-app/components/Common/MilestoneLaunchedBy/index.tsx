import { renderMentionString } from "../../../utils/common"
import { ENTITIES_TYPES } from "../../../utils/constants"
import { GET_USER } from "../../../graphql/queries"
import { useLazyQuery } from '@apollo/client'
import { useEffect } from "react"
import { Typography } from "@material-ui/core"
import styled from 'styled-components';

export const StyledText = styled(Typography)`
    && {
        color:#C4C4C4;
        font-size: 14px;
    }
`

export const StyledMention = styled(Typography)`
    && {
        color: white;
    }
`


export const MilestoneLaunchedBy = (props) => {
    const { router, type, createdBy } = props
    const [getUser, { data: getUserData }] = useLazyQuery(GET_USER)
    const isMilestone = type === ENTITIES_TYPES.MILESTONE
    useEffect(() => {
        if (isMilestone) {
            getUser({
                variables: {
                    userId: createdBy
                }
            })
        }

    }, [getUser, createdBy, isMilestone])

    if (isMilestone) {
        return (
            <StyledText>
                {renderMentionString({
                    content: `@[${getUserData?.getUser?.username}](${createdBy})launched a milestone`,
                    router,
                })}</StyledText>
        )
    } else {
        return null
    }
}