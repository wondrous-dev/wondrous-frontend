import { useEffect, useState } from 'react';
import { ChevronFilled } from 'components/Icons/sections';
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
  children: unknown[];
  headerAddons?: any;
  displayShowMore: boolean;
  onShowMore: () => any;
  showMoreTitle?: string;
  loading?: boolean;
}

const Accordion = ({
  isExpanded = true,
  Icon = null,
  title,
  count,
  children,
  headerAddons,
  displayShowMore,
  onShowMore,
  showMoreTitle = 'Show more',
  loading,
}: Props) => {
  const [isOpen, setIsOpen] = useState(isExpanded);
  const handleExpansion = () => setIsOpen(!isOpen);

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
      <AccordionDetails>{children}</AccordionDetails>
      {displayShowMore ? (
        <ShowMoreButton type="button" onClick={onShowMore}>
          {showMoreTitle}
        </ShowMoreButton>
      ) : null}
    </AccordionComponent>
  );
};

export default Accordion;
