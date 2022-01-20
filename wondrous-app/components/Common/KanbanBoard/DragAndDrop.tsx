import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const useDndProvider = () => {
  const [dndArea, setDndArea] = React.useState()
  const handleRef = React.useCallback((node) => setDndArea(node), [])
  const html5Options = React.useMemo(
    () => ({ rootElement: dndArea }),
    [dndArea]
  )
  return { dndArea, handleRef, html5Options }
}
