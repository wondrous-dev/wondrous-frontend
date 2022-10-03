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
    // eslint-disable-next-line jsx-a11y/aria-role
    <ListboxWrapper {...rest} ref={innerRef} role="list-box">
      {children}
      {!!handleFetchMore && <LoadMore ref={inViewRef} style={{ height: '2px', display: 'block' }} />}
    </ListboxWrapper>
  );
});

export default ListBox;
