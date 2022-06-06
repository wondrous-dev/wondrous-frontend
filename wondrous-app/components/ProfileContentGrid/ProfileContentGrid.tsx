import { useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Box, Button } from '@mui/material';

import { PROFILE_CARD_WIDTH, PROFILE_CARD_HEIGHT } from 'utils/constants';

import styles from './styles';

const GRID_ELEMENTS = 4;
const PADDING = 18;
const SCROLL_BAR_OFFSET = 40;

const ProfileContentGrid = ({ data, Component }) => {
  const [showVirtualized, setShowVirtualized] = useState(false);

  const Cell = ({ columnIndex, rowIndex, style, data }) => {
    const positionIndex = rowIndex * GRID_ELEMENTS + columnIndex;
    const item = data[positionIndex];

    if (!item) return <></>;

    return (
      <div style={style}>
        <Component item={item} />
      </div>
    );
  };

  const columnCount = data?.length >= GRID_ELEMENTS ? GRID_ELEMENTS : data?.length;

  return (
    <Box sx={{ ...styles.root }}>
      {showVirtualized ? (
        <Box sx={styles.virtualizationContainer}>
          <Box sx={{ height: 630 }}>
            <AutoSizer>
              {({ height, width }) => (
                <Grid
                  columnCount={columnCount}
                  columnWidth={PROFILE_CARD_WIDTH + PADDING}
                  height={height}
                  rowCount={Math.ceil(data.length / GRID_ELEMENTS)}
                  rowHeight={PROFILE_CARD_HEIGHT + PADDING}
                  width={width + SCROLL_BAR_OFFSET}
                  itemData={data}
                >
                  {Cell}
                </Grid>
              )}
            </AutoSizer>
          </Box>
          <Box sx={styles.buttonContainer}>
            <Button sx={styles.button} onClick={() => setShowVirtualized(false)}>
              Show Less
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box display="flex" alignItems="flex-start">
            {data?.slice(0, columnCount)?.map((item) => (
              <>
                <Component key={item.id} item={item} />
              </>
            ))}
          </Box>

          <Box sx={styles.buttonContainer}>
            <Button
              sx={styles.button}
              onClick={() => setShowVirtualized(true)}
              disabled={data?.length <= GRID_ELEMENTS}
            >
              Show more
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ProfileContentGrid;
