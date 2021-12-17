import React from 'react'
import { IconButton } from '@material-ui/core'

import LikeIcon from '../../Icons/like'
import CommentsIcon from '../../Icons/comments'
import ShareIcon from '../../Icons/share'
import DotsIcon from '../../Icons/dots'
import { CardHeaderCategory } from '../../CardHeaderCategory'
import { TaskMedia } from '../../Common/MediaPlayer'
import { TaskCardLogo} from '../../Common/KanbanBoard/TaskCard/styles'
import { AvatarList } from '../../Common/AvatarList'

import {
  CompletedCardFooter,
  CompletedCardFooterActivity,
  CompletedCardFooterActivityAmount,
  CompletedCardFooterActivityIconBtn,
  CompletedCardFooterBlock,
  CompletedCardText,
  CompletedCardTitle,
  OrganisationsCard,
  OrganisationsCardHeader,
} from './styles'

const AboutCompletedCard = (props) => {
  const { lastCompletedTask } = props

  const {
    actions,
    compensation,
    description,
    media,
    status,
    title,
    users,
  } = lastCompletedTask

  const {
    comments,
    likes,
    shares,
  } = actions

  return (
    <OrganisationsCard>
      <OrganisationsCardHeader>
        <TaskCardLogo />
        <AvatarList users={users} />

        <CardHeaderCategory
          compensation={compensation}
          status={status}
        />
      </OrganisationsCardHeader>

      <CompletedCardTitle>
        {title}
      </CompletedCardTitle>

      <CompletedCardText>
        {description}
      </CompletedCardText>

      <TaskMedia media={media} />

      <CompletedCardFooter>
        <CompletedCardFooterActivity>
          <CompletedCardFooterBlock>
            <CompletedCardFooterActivityIconBtn>
              <LikeIcon />
            </CompletedCardFooterActivityIconBtn>
            <CompletedCardFooterActivityAmount>
              {likes}
            </CompletedCardFooterActivityAmount>
          </CompletedCardFooterBlock>
          <CompletedCardFooterBlock>
            <CompletedCardFooterActivityIconBtn>
              <CommentsIcon />
            </CompletedCardFooterActivityIconBtn>
            <CompletedCardFooterActivityAmount>
              {comments}
            </CompletedCardFooterActivityAmount>
          </CompletedCardFooterBlock>
          <CompletedCardFooterBlock>
            <CompletedCardFooterActivityIconBtn>
              <ShareIcon />
            </CompletedCardFooterActivityIconBtn>
            <CompletedCardFooterActivityAmount>
              {shares}
            </CompletedCardFooterActivityAmount>
          </CompletedCardFooterBlock>
        </CompletedCardFooterActivity>
        <IconButton>
          <DotsIcon />
        </IconButton>
      </CompletedCardFooter>
    </OrganisationsCard>
  )
}

export default AboutCompletedCard