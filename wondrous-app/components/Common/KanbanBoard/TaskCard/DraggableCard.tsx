import { forwardRef, useImperativeHandle, useRef } from 'react';
import { DragSource, DropTarget, } from 'react-dnd';

const ItemTypes = {
  CARD: 'card',
}

const Card = ({ children, isDragging, connectDragSource, connectDropTarget }, ref) => {
  const elementRef = useRef(null);
  connectDragSource(elementRef);
  connectDropTarget(elementRef);
  const opacity = isDragging ? 0 : 1;
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }));
  return (
    <div ref={elementRef} style={{opacity}} className="draggable">
      {children}
    </div>
  );
};

const DraggableCard = DropTarget(ItemTypes.CARD, {
  hover(props, monitor, component) {
    const {
      moveCard,
      status,
    } = props as any

    if (!component) {
      return null;
    }
    // node = HTML Div element from imperative API
    const node = component.getNode();
    if (!node) {
      return null;
    }
    const dragStatus = monitor.getItem().status;

    const statusesEqual = dragStatus === status

    if (statusesEqual) {
      return;
    }

    moveCard(dragStatus, status);

    monitor.getItem().status = status;
  },
}, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))(DragSource(ItemTypes.CARD, {
  beginDrag: (props: any) => ({
    id: props.id,
    status: props.status,
  }),
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(forwardRef(Card)));

export default DraggableCard