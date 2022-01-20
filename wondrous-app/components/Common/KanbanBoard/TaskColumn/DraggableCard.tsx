import { forwardRef, useImperativeHandle, useRef } from 'react'
import { DragSource, DropTarget } from 'react-dnd'

export const ItemTypes = {
  CARD: 'card',
}

const Card = (
  { children, isDragging, isSpacer, connectDragSource, connectDropTarget },
  ref
) => {
  const elementRef = useRef(null)
  connectDragSource(elementRef)
  connectDropTarget(elementRef)
  const opacity = isDragging ? 0 : 1
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }))
  return (
    <div
      ref={elementRef}
      style={{ opacity, width: '100%' }}
      className="draggable"
    >
      {children}
    </div>
  )
}

const DraggableCard = DropTarget(
  ItemTypes.CARD,
  {
    hover(props, monitor, component) {
      const { moveCard, status: columnStatus } = props as any

      if (!component) {
        return null
      }
      // node = HTML Div element from imperative API
      const node = component.getNode()
      if (!node) {
        return null
      }
      const draggableItem = monitor.getItem()
      const { id, orgId, podId, status: dragStatus } = draggableItem

      const statusesEqual = dragStatus === columnStatus

      if (statusesEqual) {
        return
      }

      moveCard(id, columnStatus)

      monitor.getItem().status = columnStatus
    },
  },
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })
)(
  DragSource(
    ItemTypes.CARD,
    {
      beginDrag: (props: any) => ({
        id: props.id,
        assigneeId: props.assigneeId,
        createdBy: props.createdBy,
        orgId: props.orgId,
        podId: props.podId,
        status: props.status,
      }),
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(forwardRef(Card))
)

export default DraggableCard
