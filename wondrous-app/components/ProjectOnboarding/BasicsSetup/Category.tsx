import { Box, Grid, Typography } from '@mui/material';
import { HeaderButton } from 'components/organization/wrapper/styles';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { DAO_CATEGORIES } from 'utils/constants';
import { ButtonsPanel } from '../Shared';

const Category = ({ onClick, updateData, data }) => {
  const handleCategoryClick = (category) => {
    const newCategory = category === data.category ? '' : category;

    updateData((prev) => ({
      ...prev,
      category: newCategory,
    }));
  };
  return (
    <Grid container direction="column" height="100%" justifyContent="space-between">
      <Grid display="flex" gap="14px" flexWrap="wrap">
        {Object.keys(DAO_CATEGORIES).map((category, index) => (
          <Grid
            key={category}
            bgcolor={data.category === category ? palette.grey79 : palette.grey85}
            flexBasis={{
              xs: '48%',
              sm: '32%',
              md: '23%',
            }}
            onClick={() => handleCategoryClick(category)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: palette.grey79,
              },
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding="32px 12px"
            borderRadius="6px"
          >
            <Typography
              color={palette.white}
              fontFamily={typography.fontFamily}
              fontWeight={500}
              lineHeight="13px"
              fontSize="13px"
            >
              {DAO_CATEGORIES[category]}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <ButtonsPanel onContinue={onClick} />
    </Grid>
  );
};

export default Category;
