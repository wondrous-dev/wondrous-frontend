import Typography from '@mui/material/Typography';
import { GRANTS_FILTERS } from 'services/board';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { Wrapper, IconWrapper, ItemWrapper } from './styles';

const GrantsFilters = ({ onFilterChange, activeFilter }) => {
  console.log(activeFilter, 'active filter');
  return (
    <Wrapper>
      {GRANTS_FILTERS.map((filter, idx) => (
        <ItemWrapper
          key={idx}
          onClick={() => onFilterChange(filter.value)}
          type="button"
          isActive={activeFilter === filter.value}
        >
          <IconWrapper>
            <filter.icon />
          </IconWrapper>
          <Typography color={palette.white} fontWeight={500} fontSize={14} fontFamily={typography.fontFamily}>
            {filter.label}
          </Typography>
        </ItemWrapper>
      ))}
    </Wrapper>
  );
};

export default GrantsFilters;
