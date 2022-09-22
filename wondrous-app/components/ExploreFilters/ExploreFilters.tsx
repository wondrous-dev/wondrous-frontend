import { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

import SearchIcon from 'components/Icons/search';
import CloseModalIcon from 'components/Icons/closeModal';

import { blueColors } from 'theme/colors';
import styles from './styles';

const WORK_CATEGORIES = [
  {
    label: '💻 UI/UX Design',
    value: 'ui_ux_designer',
  },
  {
    label: '‍🎨 Graphic Design',
    value: 'graphic_design',
  },
  {
    label: '👥 Social Media',
    value: 'social_media',
  },
  {
    label: '✍️ Writing',
    value: 'content_creation',
  },
  {
    label: '💀 Memes',
    value: 'memes',
  },
  {
    label: '🖼 NFT',
    value: 'nft',
  },
  {
    label: '🪐 Governance',
    value: 'governance',
  },
  {
    label: '🫂 DEFI',
    value: 'defi',
  },
  {
    label: '⚙ Engineering',
    value: 'engineering',
  },
];

const AGE_CATEGORIES = [
  {
    label: 'Overdue',
    value: 'overdue',
  },
  {
    label: 'Due this week',
    value: 'due_this_week',
  },
  {
    label: 'Due next week',
    value: 'due_next_week',
  },
];

const ExploreFilters = ({ open, setOpen, updateFilter }) => {
  const [workCategorySelected, setWorkCategorySelected] = useState('');
  const [ageCategorySelected, setAgeCategorySelected] = useState('');
  // const [isApplications, setIsApplications] = useState(false);

  const handleWorkTagClick = (item) => {
    if (workCategorySelected === item.value) {
      updateFilter({
        category: null,
      });
      setWorkCategorySelected('');
      return;
    }
    updateFilter({ category: item.value });
    setWorkCategorySelected(item.value);
  };

  const handleAgeTagClick = (item) => {
    if (ageCategorySelected === item.value) {
      updateFilter({
        date: null,
      });
      setAgeCategorySelected('');
      return;
    }
    updateFilter({ date: item.value });
    setAgeCategorySelected(item.value);
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
                <SearchIcon color={blueColors.blue20} />
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
            {WORK_CATEGORIES.map((workCat) => (
              <Box
                key={workCat.value}
                sx={{
                  ...styles.categoryTag,
                  ...(workCategorySelected === workCat.value && styles.activeTag),
                }}
                onClick={() => handleWorkTagClick(workCat)}
              >
                <Typography sx={{ ...styles.labelCategory, fontSize: 13 }}>{workCat.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={styles.divider} />
        {/* TODO(cristobalchao): Add this when BE is ready
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
        <Box sx={styles.divider} /> */}
        <Box>
          <Typography sx={styles.sectionTitle}>Age of task</Typography>
          <Box sx={styles.categoryContainer}>
            {AGE_CATEGORIES.map((ageCat) => (
              <Box
                key={ageCat.value.toString()}
                sx={{
                  ...styles.categoryTag,
                  ...(ageCategorySelected === ageCat.value && styles.activeTag),
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
