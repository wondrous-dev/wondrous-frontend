import { Box, Grid, Typography } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { ANALYTIC_EVENTS, DAO_CATEGORIES } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import { ButtonsPanel, sendAnalyticsData } from '../Shared';

const Category = ({ handleNextStep }) => {
  const user = useMe();
  const { updateOrg, orgData, orgId } = useOrgBoard();
  const [orgCategory, setOrgCategory] = useState(orgData?.category || null);
  const handleCategoryClick = (category) => {
    const newCategory = category === orgCategory ? '' : category;
    setOrgCategory(newCategory);
  };

  const handleCategoryUpdate = async () => {
    if (!orgData?.category && !orgCategory) {
      sendAnalyticsData(ANALYTIC_EVENTS.ONBOARDING_CATEGORY_SELECT_SKIP, {
        orgId,
        userId: user?.id,
      });
    }

    if (orgData?.category !== orgCategory) {
      await updateOrg({ category: orgCategory });
      sendAnalyticsData(ANALYTIC_EVENTS.ONBOARDING_CATEGORY_SELECT, {
        category: orgCategory,
        orgId,
        userId: user?.id,
      });
    }
    handleNextStep();
  };

  return (
    <Grid container direction="column" height="100%" justifyContent="space-between" gap="42px">
      <Grid display="flex" gap="14px" flexWrap="wrap">
        {Object.keys(DAO_CATEGORIES).map((item, index) => {
          const isActive = orgCategory === item;
          return (
            <Grid
              key={item}
              bgcolor={isActive ? palette.grey79 : palette.grey85}
              flexBasis={{
                xs: '47%',
                sm: '32%',
                md: '23%',
              }}
              flexGrow={1}
              onClick={() => handleCategoryClick(item)}
              sx={{
                outline: isActive ? `1px solid ${palette.highlightPurple}` : 'none',
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
          );
        })}
      </Grid>
      <ButtonsPanel onContinue={handleCategoryUpdate} />
    </Grid>
  );
};

export default Category;
