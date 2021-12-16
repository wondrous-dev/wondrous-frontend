import React from 'react';

import LikeIcon from '../../Icons/like'
import CommentsIcon from '../../Icons/comments'
import ShareIcon from '../../Icons/share'
import DotsIcon from '../../Icons/dots'
import { CardHeaderCategory } from '../../CardHeaderCategory'
import {TASK_STATUS_DONE} from "../../../utils/constants";
import {TaskMedia} from "../../Common/MediaPlayer";

import {
  CompletedCard,
  CompletedCardAvatar,
  CompletedCardFooter,
  CompletedCardFooterActivity,
  CompletedCardFooterActivityAmount,
  CompletedCardFooterActivityIconBtn,
  CompletedCardFooterBlock,
  CompletedCardFooterSettingsBtn,
  CompletedCardHeader,
  CompletedCardIcon,
  CompletedCardText,
  CompletedCardTitle
} from './styles'

export const AboutCompletedCard = () => {
  return (
    <CompletedCard>
      <CompletedCardHeader>
        <div>
          <CompletedCardIcon />
          <CompletedCardAvatar src='/images/boards/avatar.png'/>
        </div>

        <CardHeaderCategory
          status={TASK_STATUS_DONE}
          starCount={2400}
        />

      </CompletedCardHeader>
      <CompletedCardTitle>
        🔥Narrate our showreel🔥
      </CompletedCardTitle>
      <CompletedCardText>
        Maecenas hendrerit porttitor integer viverra lorem metus et in.
      </CompletedCardText>
      <TaskMedia
        media={{
          type: 'audio',
          url: 'https://soundcloud.com/undiscoveredsounds/coldplay-ft-beyonce-hymn-for-the-weekend-ash-remix'
        }}
      />
      <CompletedCardFooter>
        <CompletedCardFooterActivity>
          <CompletedCardFooterBlock>
            <CompletedCardFooterActivityIconBtn>
              <LikeIcon />
            </CompletedCardFooterActivityIconBtn>
            <CompletedCardFooterActivityAmount>
              30
            </CompletedCardFooterActivityAmount>
          </CompletedCardFooterBlock>
          <CompletedCardFooterBlock>
            <CompletedCardFooterActivityIconBtn>
              <CommentsIcon />
            </CompletedCardFooterActivityIconBtn>
            <CompletedCardFooterActivityAmount>
              19
            </CompletedCardFooterActivityAmount>
          </CompletedCardFooterBlock>
          <CompletedCardFooterBlock>
            <CompletedCardFooterActivityIconBtn>
              <ShareIcon />
            </CompletedCardFooterActivityIconBtn>
            <CompletedCardFooterActivityAmount>
              16
            </CompletedCardFooterActivityAmount>
          </CompletedCardFooterBlock>
        </CompletedCardFooterActivity>
        <CompletedCardFooterSettingsBtn>
          <DotsIcon />
        </CompletedCardFooterSettingsBtn>
      </CompletedCardFooter>
    </CompletedCard>
  );
}