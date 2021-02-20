import React from 'react'
import Sad from '../../assets/images/emoji/sad'
import SlightFrown from '../../assets/images/emoji/slightFrown'
import Neutral from '../../assets/images/emoji/neutral'
import Smile from '../../assets/images/emoji/smile'
import StarEyes from '../../assets/images/emoji/starEyes'

export const GetReviewIcon = ({ review, style }) => {
  const {
    reviewScore
  } = review
  if (reviewScore === 1) {
    return <Sad style={style} />
  } else if (reviewScore === 2) {
    return <SlightFrown style={style} />
  } else if (reviewScore === 3) {
    return <Neutral style={style} />
  } else if (reviewScore === 4) {
    return <Smile style={style} />
  } else if (reviewScore === 5) {
    return <StarEyes style={style} />
  }
}
