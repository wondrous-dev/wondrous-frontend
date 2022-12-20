import { useEffect, useState } from 'react';
import { ChevronFilled } from 'components/Icons/sections';
import { useInView } from 'react-intersection-observer';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import {
  AccordionComponent,
  AccordionDetails,
  ListViewItemHeader,
  ListViewItemStatus,
  ListViewItemCount,
  ShowMoreButton,
} from './styles';

interface Props {
  isExpanded?: boolean;
  Icon?: any;
  title: string;
  count: number;
  children: any;
  headerAddons?: any;
  hasMore?: boolean;
  onShowMore?: () => any;
  showMoreTitle?: string;
  loading?: boolean;
  enableInfiniteLoading?: boolean;
  noGap?: boolean;
  highlighted?: boolean;
}

const Accordion = ({
  isExpanded = true,
  Icon = null,
  title,
  count,
  children,
  headerAddons,
  hasMore,
  onShowMore,
  showMoreTitle = 'Show more',
  loading,
  enableInfiniteLoading = false,
  noGap = false,
  highlighted = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(isExpanded);
  const handleExpansion = () => setIsOpen(!isOpen);

  const [ref, inView] = useInView({});

  useEffect(() => {
    if (inView && hasMore && enableInfiniteLoading) {
      onShowMore();
    }
  }, [inView, hasMore, onShowMore, enableInfiniteLoading]);

  useEffect(() => {
    if (typeof loading === 'boolean' && !loading && isExpanded !== isOpen) {
      setIsOpen(isExpanded);
    }
  }, [loading]);
  return (
    <AccordionComponent expanded={isOpen}>
      <ListViewItemHeader>
        <ListViewItemStatus isExpanded={isOpen} onClick={() => handleExpansion()}>
          <ChevronFilled fill="white" className="accordion-expansion-icon" />
          {Icon ? <Icon /> : null}
          {title}
          <ListViewItemCount>{count}</ListViewItemCount>
        </ListViewItemStatus>
        {headerAddons || null}
      </ListViewItemHeader>
      <AccordionDetails highlighted={highlighted} noGap={noGap}>
        {children}
      </AccordionDetails>
      {enableInfiniteLoading && <LoadMore ref={ref} hasMore={hasMore} />}
      {hasMore && !enableInfiniteLoading ? (
        <ShowMoreButton type="button" onClick={onShowMore}>
          {showMoreTitle}
        </ShowMoreButton>
      ) : null}
    </AccordionComponent>
  );
};

export default Accordion;
