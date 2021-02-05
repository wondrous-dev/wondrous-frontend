import {
  useContext,
  useRef,
  useEffect
} from 'react'

import { CommentContext, TextEditorContext, ProfileContext } from './contexts'

export const useComment = () => useContext(CommentContext)

export const useTextEditor = () => useContext(TextEditorContext)

export const useProfile = () => useContext(ProfileContext)

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
