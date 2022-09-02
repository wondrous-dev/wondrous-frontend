import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { LoadMore } from 'components/SearchTasks/styles';
import { useInView } from 'react-intersection-observer';
import { ListboxWrapper } from './styles';

const ListBox = forwardRef((props: any, ref: any) => {
  const [inViewRef, inView] = useInView({});
  const { children, hasMore, handleFetchMore, ...rest } = props;

  const innerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (hasMore && inView) handleFetchMore();
  }, [hasMore, inView]);

  useImperativeHandle(ref, () => innerRef.current);

  return (
    <ListboxWrapper {...rest} ref={innerRef} role="listbox">
      {children}
      <LoadMore ref={inViewRef} style={{ height: '2px' }} />
    </ListboxWrapper>
  );
});

export default ListBox;
