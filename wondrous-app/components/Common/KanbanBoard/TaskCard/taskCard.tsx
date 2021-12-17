import React from 'react'

import { CardHeaderCategory } from '../../../CardHeaderCategory'
import LikeIcon from '../../../Icons/like'
import CommentsIcon from '../../../Icons/comments'
import ShareIcon from '../../../Icons/share'
import DotsIcon from '../../../Icons/dots'
import { TaskMedia } from '../../MediaPlayer'

import {
  TaskCardWrapper,
  TaskCardAvatar,
  TaskCardAvatarBlock,
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

export interface ITaskCard {
  authorAvatar: string
  comments: number
  id: number | string
  likes: number
  media: { type: string, url: string }
  shares: number
  starCount: number
  status: string
  text: string
  title: string
}

const TaskCard = (props: ITaskCard) => {
  const {
    likes,
    comments,
    shares,
    authorAvatar,
    media,
    status,
    starCount,
    title,
    text,
  } = props

  return (
    <TaskCardWrapper>
      <TaskCardHeader>
        <TaskCardLogo />
        <TaskCardAvatarBlock>
          <TaskCardAvatar src={authorAvatar} />
        </TaskCardAvatarBlock>

        <CardHeaderCategory
          status={status}
          starCount={starCount}
        />

      </TaskCardHeader>
      <TaskCardContent>
        <TaskCardContentTitle>{title}</TaskCardContentTitle>
        <TaskCardContentText>{text}</TaskCardContentText>
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