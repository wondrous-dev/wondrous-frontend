import Typography from '@mui/material/Typography';
import { GRANTS_STATUSES } from 'utils/constants';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { GrantStatusActiveIcon, GrantStatusCompleted, GrantStatusNotStarted } from 'components/Icons/GrantStatusIcons';
import { Wrapper, IconWrapper, ItemWrapper } from './styles';

export const GRANTS_ICONS_LABELS_MAP = {
  [GRANTS_STATUSES.OPEN]: {
    label: 'Active',
    icon: GrantStatusActiveIcon,
  },
  [GRANTS_STATUSES.CLOSED]: {
    label: 'Completed',
    icon: GrantStatusCompleted,
  },
};
const GrantsFilters = ({ onFilterChange, activeFilter }) => (
  <Wrapper>
    {Object.keys(GRANTS_ICONS_LABELS_MAP).map((filter, idx) => {
      const { label, icon: Icon } = GRANTS_ICONS_LABELS_MAP[filter];
      return (
        <ItemWrapper key={idx} onClick={() => onFilterChange(filter)} type="button" isActive={activeFilter === filter}>
          <IconWrapper>
            <Icon />
          </IconWrapper>
          <Typography color={palette.white} fontWeight={500} fontSize={14} fontFamily={typography.fontFamily}>
            {label}
          </Typography>
        </ItemWrapper>
      );
    })}
  </Wrapper>
);

export default GrantsFilters;
