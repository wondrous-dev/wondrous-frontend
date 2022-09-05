import { useState } from 'react';
import uniqBy from 'lodash/uniqBy';
import { subDays } from 'date-fns';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';

import SearchIcon from 'components/Icons/search';
import CloseModalIcon from 'components/Icons/closeModal';
import Switch from 'components/Common/Switch';

import styles from './styles';

const workCategories = [
  {
    label: '💻 UI Design',
    value: 'uiDesign',
  },
  {
    label: '‍🎨 Illustration',
    value: 'illustration',
  },
  {
    label: '🚀 Startups',
    value: 'startups',
  },
  {
    label: '🗣 Translations',
    value: 'translations',
  },
  {
    label: '💀 Memes',
    value: 'memes',
  },
  {
    label: '🔎 SEO',
    value: 'seo',
  },
  {
    label: '✍️ Writing',
    value: 'writing',
  },
  {
    label: '⚙ Product',
    value: 'product',
  },
];

const ageCategories = [
  {
    label: 'Today',
    value: new Date(),
  },
  {
    label: 'This week',
    value: subDays(new Date(), 7),
  },
  {
    label: 'Last week',
    value: subDays(new Date(), 14),
  },
  {
    label: 'This month',
    value: subDays(new Date(), 30),
  },
];

const UNIQUE_KEY = 'value';

const ExploreFilters = ({ open, setOpen, updateFilter }) => {
  const [workCategoriesSelected, setWorkCategoriesSelected] = useState([]);
  const [ageCategoriesSelected, setAgeCategoriesSelected] = useState([]);
  const [isApplications, setIsApplications] = useState(false);

  const handleWorkTagClick = (item) => {
    // TODO: to know what category is handle by back since none of this ones are valid. Ask how a multiple string posibility query is builded on apollo.
    if (workCategoriesSelected.find((selCategory) => selCategory.value === item.value)) {
      const updateCategoriesUnselected = workCategoriesSelected.filter(
        (selCategory) => selCategory.value !== item.value
      );
      updateFilter({
        category:
          updateCategoriesUnselected.length === 0
            ? null
            : updateCategoriesUnselected.map((workCategory) => workCategory.value),
      });
      setWorkCategoriesSelected(updateCategoriesUnselected);
      return;
    }
    const updatedCategoriesSelected = uniqBy([...workCategoriesSelected, item], UNIQUE_KEY);
    updateFilter({ category: updatedCategoriesSelected.map((workCategory) => workCategory.value) });
    setWorkCategoriesSelected(updatedCategoriesSelected);
  };

  const handleAgeTagClick = (item) => {
    if (ageCategoriesSelected.find((selCategory) => selCategory.value === item.value)) {
      const updateAgeCategoriesUnselected = ageCategoriesSelected.filter(
        (selCategory) => selCategory.value !== item.value
      );
      const oldestDate = updateAgeCategoriesUnselected.sort(
        (dateA, dateB) => Number(dateA.value) - Number(dateB.value)
      )[0]?.value;
      updateFilter({
        date: oldestDate || null,
      });
      setAgeCategoriesSelected(updateAgeCategoriesUnselected);
      return;
    }
    const updateAgeCategoriesSelected = uniqBy([...ageCategoriesSelected, item], UNIQUE_KEY);
    const oldestDate = updateAgeCategoriesSelected.sort((dateA, dateB) => Number(dateA.value) - Number(dateB.value))[0]
      ?.value;
    updateFilter({
      date: oldestDate || null,
    });
    setAgeCategoriesSelected(updateAgeCategoriesSelected);
  };

  return (
    <Box sx={{ ...styles.root, ...(open && styles.showFilters) }}>
      <Box sx={{ ...styles.filterRoot }}>
        <Button sx={styles.closeButton} onClick={() => setOpen(false)}>
          <CloseModalIcon />
          <Typography sx={styles.closeText}>Close filters</Typography>
        </Button>
        <TextField
          sx={styles.searchTextfield}
          onChange={(e) => {
            updateFilter({ keyword: e.target.value });
          }}
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="#CCBBFF" />
              </InputAdornment>
            ),
          }}
        >
          Search
        </TextField>
        <Box sx={styles.divider} />
        <Box>
          <Typography sx={styles.sectionTitle}>Work Type</Typography>
          <Box sx={styles.categoryContainer}>
            {workCategories.map((workCat) => (
              <Box
                key={workCat.value}
                sx={{
                  ...styles.categoryTag,
                  ...(workCategoriesSelected.find((selCategory) => selCategory.value === workCat.value) &&
                    styles.activeTag),
                }}
                onClick={() => handleWorkTagClick(workCat)}
              >
                <Typography sx={{ ...styles.labelCategory, fontSize: 13 }}>{workCat.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={styles.divider} />
        <Box>
          <Typography sx={styles.sectionTitle}>Applications</Typography>
          <FormControlLabel
            sx={{ mx: 0, mt: 1.5 }}
            labelPlacement="start"
            control={
              <Switch
                label="Required"
                size="medium"
                checked={isApplications}
                onChange={(e) => {
                  setIsApplications(!isApplications);
                  // TODO BE integration
                }}
              />
            }
            label={<Typography sx={styles.switchLabel}>Required</Typography>}
          />
        </Box>
        <Box sx={styles.divider} />
        <Box>
          <Typography sx={styles.sectionTitle}>Age of task</Typography>
          <Box sx={styles.categoryContainer}>
            {ageCategories.map((ageCat) => (
              <Box
                key={ageCat.value.toString()}
                sx={{
                  ...styles.categoryTag,
                  ...(ageCategoriesSelected.find((selCategory) => selCategory.value === ageCat.value) &&
                    styles.activeTag),
                }}
                onClick={() => handleAgeTagClick(ageCat)}
              >
                <Typography sx={styles.labelCategory}>{ageCat.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={styles.divider} />
      </Box>
    </Box>
  );
};

export default ExploreFilters;
