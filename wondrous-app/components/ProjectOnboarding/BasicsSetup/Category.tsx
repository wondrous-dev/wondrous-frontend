import { Box, Grid, Typography } from '@mui/material';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { DAO_CATEGORIES } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import { ButtonsPanel } from '../Shared';

const Category = ({ handleNextStep }) => {
  const { updateOrg, orgData } = useOrgBoard();
  const [orgCategory, setOrgCategory] = useState(orgData?.category || null);
  const handleCategoryClick = (category) => {
    const newCategory = category === orgCategory ? '' : category;
    setOrgCategory(newCategory);
  };

  const handleCategoryUpdate = async () => {
    if (orgData?.category !== orgCategory) {
      await updateOrg({ category: orgCategory });
    }

    handleNextStep();
  };

  return (
    <Grid container direction="column" height="100%" justifyContent="space-between" gap="42px">
      <Grid display="flex" gap="14px" flexWrap="wrap">
        {Object.keys(DAO_CATEGORIES).map((item, index) => (
          <Grid
            key={item}
            bgcolor={orgCategory === item ? palette.grey79 : palette.grey85}
            flexBasis={{
              xs: '47%',
              sm: '32%',
              md: '23%',
            }}
            flexGrow={1}
            onClick={() => handleCategoryClick(item)}
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
              {DAO_CATEGORIES[item]}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <ButtonsPanel onContinue={handleCategoryUpdate} />
    </Grid>
  );
};

export default Category;
