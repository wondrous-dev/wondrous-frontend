import OrgItem from 'components/OrgItem';
import Masonry from '@mui/lab/Masonry';

import { FEATURED_LIST } from 'utils/constants';

import { gridMobileStyles } from 'utils/styles';
import { OrgsSectionHeader, SectionSubheader, SectionWrapper } from './styles';

const DaoSection = ({ isMobile }) => (
  <SectionWrapper>
    <OrgsSectionHeader>Our Alpha Partners</OrgsSectionHeader>
    <SectionSubheader>Work with the best Web3 teams in the space.</SectionSubheader>
    <Masonry spacing={3} columns={{ xs: 1, sm: 2, md: 2, lg: 3 }} style={isMobile ? gridMobileStyles : {}}>
      {FEATURED_LIST.map((org, index) => (
        <OrgItem key={index} org={org} />
      ))}
    </Masonry>
  </SectionWrapper>
);

export default DaoSection;
