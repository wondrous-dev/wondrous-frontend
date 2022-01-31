import { forwardRef, useImperativeHandle, useRef } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import SmoothScrollPlugin from '../../../../utils/dragAndDrop';

export const ItemTypes = {
  CARD: 'card',
};
const plugin = new SmoothScrollPlugin();

const Card = ({ children, isDragging, isSpacer, connectDragSource, connectDropTarget }, ref) => {
  const elementRef = useRef(null);
  connectDragSource(elementRef);
  connectDropTarget(elementRef);
  const opacity = isDragging ? 0 : 1;
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }));
  return (
    <div ref={elementRef} style={{ opacity, width: '100%' }} className="draggable">
      {children}
    </div>
  );
};

const DraggableCard = DropTarget(
  ItemTypes.CARD,
  {
    hover(props: any, monitor, component) {
      const { moveCard, status: columnStatus, index } = props as any;
      if (!component) {
        return null;
      }
      // node = HTML Div element from imperative API
      const node = component.getNode();
      if (!node) {
        return null;
      }
      const draggableItem = monitor.getItem();
      const { id, orgId, podId, status: dragStatus } = draggableItem;

      if (id !== props.id) {
        moveCard(id, columnStatus, index);
      }

      monitor.getItem().status = columnStatus;
    },
  },
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })
)(
  DragSource(
    ItemTypes.CARD,
    {
      beginDrag: (props: any) => {
        plugin.onDragStart();
        return {
          id: props.id,
          assigneeId: props.assigneeId,
          createdBy: props.createdBy,
          orgId: props.orgId,
          podId: props.podId,
          status: props.status,
        };
      },
      endDrag: () => {
        plugin.onDragEnd();
      },
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(forwardRef(Card))
);

export default DraggableCard;
