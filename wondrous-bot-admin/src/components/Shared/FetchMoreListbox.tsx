import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const ListboxComponent = ({ children, hasMore = false, handleFetchMore, ...props }) => {
  const [inViewRef, inView] = useInView({});

  console.log(hasMore, inView, 'HERE?')
  useEffect(() => {
    if (hasMore && inView) handleFetchMore();
  }, [hasMore, inView]);
  return (
    <ul role="listbox" {...props}>
      {children}
      {!!handleFetchMore && <div ref={inViewRef} style={{ height: "1px", display: "block" }} />}
    </ul>
  );
};
