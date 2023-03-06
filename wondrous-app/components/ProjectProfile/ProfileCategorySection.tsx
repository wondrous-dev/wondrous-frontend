import Grid from '@mui/material/Grid';
import FolderIcon from 'components/Icons/Sidebar/folder.svg';
import palette from 'theme/palette';
import { randomColors } from 'utils/common';

import { useCategoriesButtonProps, useGetDocumentCategories } from './helpers';
import SectionContent from './SectionContent';

const LeftComponent = ({ name }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    <Grid
      container
      width="22px"
      height="22px"
      bgcolor={randomColors}
      borderRadius="4px"
      alignItems="center"
      justifyContent="center"
      padding="0"
    >
      <FolderIcon />
    </Grid>
    {name}
  </Grid>
);

const ProfileCategorySection = () => (
  <SectionContent
    HeaderTitleProps={{
      text: 'Documentation',
      IconComponent: FolderIcon,
    }}
    CreateButtonProps={useCategoriesButtonProps()}
    backgroundImageUrl="/images/project/category-empty-bg.svg"
    showAllUrl="docs"
    ListItemProps={{
      LeftComponent,
      onClick: ({ router, data: { id }, entityLink }) => router.push(`${entityLink}/docs?id=${id}`),
    }}
    data={useGetDocumentCategories()}
    tourId="tour-header-project-docs"
  />
);

export default ProfileCategorySection;
