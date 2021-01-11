import {
  useContext
} from 'react'

import { CommentContext, TextEditorContext, ProfileContext } from './contexts'

export const useComment = () => useContext(CommentContext)

export const useTextEditor = () => useContext(TextEditorContext)

export const useProfile = () => useContext(ProfileContext)
