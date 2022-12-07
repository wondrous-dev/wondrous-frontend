import Grid from '@mui/material/Grid';
import FolderIcon from 'components/Icons/Sidebar/folder.svg';
import palette from 'theme/palette';
import { randomColors } from 'utils/common';

import { useCategoriesButtonProps, useGetOrgDocumentCategories } from './helpers';
import ListWrapper from './ListWrapper';

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

const ListCategory = () => (
  <ListWrapper
    HeaderTitleProps={{
      text: 'Category',
      IconComponent: FolderIcon,
    }}
    CreateButtonProps={useCategoriesButtonProps()}
    backgroundImageUrl="/images/project/document-empty-bg.svg"
    showAllUrl="docs"
    ListItemProps={{
      LeftComponent,
      onClick: (router, { id }) => router.push(`/organization/${router.query.username}/docs?id=${id}`),
    }}
    data={useGetOrgDocumentCategories()}
  />
);

export default ListCategory;
