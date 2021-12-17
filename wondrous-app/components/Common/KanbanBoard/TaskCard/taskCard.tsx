import React from 'react'

import { CardHeaderCategory } from '../../../CardHeaderCategory'
import LikeIcon from '../../../Icons/like'
import CommentsIcon from '../../../Icons/comments'
import ShareIcon from '../../../Icons/share'
import DotsIcon from '../../../Icons/dots'
import { TaskMedia } from '../../MediaPlayer'
import { AvatarList } from '../../AvatarList'

import {
  TaskCardWrapper,
  TaskCardContent,
  TaskCardContentText,
  TaskCardContentTitle,
  TaskCardFooter,
  TaskCardFooterActivity,
  TaskCardFooterComment,
  TaskCardFooterCommentCount,
  TaskCardFooterLike,
  TaskCardFooterLikeCount, 
  TaskCardFooterSettings,
  TaskCardFooterShare,
  TaskCardFooterShareCount,
  TaskCardHeader,
  TaskCardLogo
} from './styles'

const TaskCard = (props) => {
  const {
    actions,
    compensation,
    description,
    media,
    status,
    title,
    users,
  } = props

  const {
    comments,
    likes,
    shares,
  } = actions

  return (
    <TaskCardWrapper>
      <TaskCardHeader>
        <TaskCardLogo />
        <AvatarList users={users} />

        <CardHeaderCategory
          compensation={compensation}
          status={status}
        />

      </TaskCardHeader>
      <TaskCardContent>
        <TaskCardContentTitle>{title}</TaskCardContentTitle>
        <TaskCardContentText>{description}</TaskCardContentText>
        {media && <TaskMedia media={media} />}
      </TaskCardContent>
      <TaskCardFooter>
        <TaskCardFooterActivity>
          <TaskCardFooterLike>
            <LikeIcon />
            <TaskCardFooterLikeCount>{likes}</TaskCardFooterLikeCount>
          </TaskCardFooterLike>
          <TaskCardFooterComment>
            <CommentsIcon />
            <TaskCardFooterCommentCount>
              {comments}
            </TaskCardFooterCommentCount>
          </TaskCardFooterComment>
          <TaskCardFooterShare>
            <ShareIcon />
            <TaskCardFooterShareCount>{shares}</TaskCardFooterShareCount>
          </TaskCardFooterShare>
        </TaskCardFooterActivity>
        <TaskCardFooterSettings>
          <DotsIcon />
        </TaskCardFooterSettings>
      </TaskCardFooter>
    </TaskCardWrapper>
  )
}

export default TaskCard