import { useState } from 'react';
import {
  AccordionComponent,
  AccordionDetails,
  ListViewItemHeader,
  ListViewItemStatus,
  ListViewItemCount,
  ShowMoreButton,
} from './styles';
import { ChevronFilled } from 'components/Icons/sections';

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
}) => {
  const [isOpen, setIsOpen] = useState(isExpanded);
  const handleExpansion = () => setIsOpen(!isOpen);

  return (
    <AccordionComponent expanded={isOpen}>
      <ListViewItemHeader>
        <ListViewItemStatus isExpanded={isOpen} onClick={() => handleExpansion()}>
          <ChevronFilled fill="white" className="accordion-expansion-icon" />
          {Icon ? <Icon /> : null}
          {title}
          <ListViewItemCount>{count}</ListViewItemCount>
        </ListViewItemStatus>
        {headerAddons ? headerAddons : null}
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
