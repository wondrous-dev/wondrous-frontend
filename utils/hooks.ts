import {
  useContext
} from 'react'

import { CommentContext, TextEditorContext } from './contexts'

export const useComment = () => useContext(CommentContext)

export const useTextEditor = () => useContext(TextEditorContext)