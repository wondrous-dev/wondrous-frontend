import {
  useContext
} from 'react'

import { CommentContext } from './contexts'

export const useComment = () => useContext(CommentContext)