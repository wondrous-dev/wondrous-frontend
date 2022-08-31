import { useState } from 'react';
import uniqBy from 'lodash/uniqBy';

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
    label: '🔎 SEO',
    value: 'seo',
  },
  {
    label: '✍️ Writing',
    value: 'writing',
  },
  {
    label: '⚙ Product',
    value: 'product',
  },
];

const ageCategories = [
  {
    label: 'Today',
    value: 'fresh',
  },
  {
    label: 'This week',
    value: 'week',
  },
  {
    label: 'Last week',
    value: 'lastWeek',
  },
  {
    label: 'This month',
    value: 'month',
  },
];

const UNIQUE_KEY = 'value';

const ExploreFilters = ({ open, setOpen }) => {
  const [workCategoriesSelected, setWorkCategoriesSelected] = useState([]);
  const [ageCategoriesSelected, setAgeCategoriesSelected] = useState([]);
  const [isApplications, setIsApplications] = useState(false);

  const handleWorkTagClick = (item) => {
    if (workCategoriesSelected.find((selCategory) => selCategory.value === item.value)) {
      setWorkCategoriesSelected(workCategoriesSelected.filter((selCategory) => selCategory.value !== item.value));
      return;
    }
    setWorkCategoriesSelected(uniqBy([...workCategoriesSelected, item], UNIQUE_KEY));
  };

  const handleAgeTagClick = (item) => {
    if (ageCategoriesSelected.find((selCategory) => selCategory.value === item.value)) {
      setAgeCategoriesSelected(ageCategoriesSelected.filter((selCategory) => selCategory.value !== item.value));
      return;
    }
    setAgeCategoriesSelected(uniqBy([...ageCategoriesSelected, item], UNIQUE_KEY));
  };

  return (
    <Box sx={{ ...styles.root, ...(open && styles.showFilters) }}>
      <Button sx={styles.closeButton} onClick={() => setOpen(false)}>
        <CloseModalIcon />
        <Typography sx={styles.closeText}>Close filters</Typography>
      </Button>
      <TextField
        sx={styles.searchTextfield}
        onChange={() => {
          // TODO BE integration
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
              key={ageCat.value}
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
  );
};

export default ExploreFilters;
