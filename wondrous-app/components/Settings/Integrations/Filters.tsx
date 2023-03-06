import { Grid } from '@mui/material';
import { FILTER_TYPES } from './constants';
import { FilterItem } from './styles';

interface Props {
  onChange: (activeFilterType: string) => void;
  count: {
    active: number;
    inactive: number;
    total: number;
  };
  activeType: string;
}

const IntegrationsFilters = ({ onChange, count, activeType }: Props) => {
  const config = [
    {
      type: FILTER_TYPES.ALL,
      title: 'All',
      count: count.total || 0,
    },
    {
      type: FILTER_TYPES.ACTIVE,
      title: 'Active',
      count: count.active || 0,
    },
    {
      type: FILTER_TYPES.INACTIVE,
      title: 'Inactive',
      count: count.inactive || 0,
    },
  ];
  const handleChange = (e, type) => {
    e.stopPropagation();
    onChange(type);
  };

  return (
    <Grid display="flex" gap="14px">
      {config.map((item) => {
        const isActive = activeType === item.type;
        return (
          <FilterItem isActive={isActive} type="button" onClick={(e) => handleChange(e, item.type)}>
            {item.title} ({item.count})
          </FilterItem>
        );
      })}
    </Grid>
  );
};

export default IntegrationsFilters;
