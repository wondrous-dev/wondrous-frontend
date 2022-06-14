import { useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Box, Button } from '@mui/material';

import { PROFILE_CARD_WIDTH, PROFILE_CARD_HEIGHT } from 'utils/constants';

import styles from './styles';

const GRID_ROW_AMOUNT = 4;
const PADDING_PX = 18;
const SCROLL_BAR_OFFSET = 40;

const ProfileContentGrid = ({ data, Component }) => {
  const [showVirtualized, setShowVirtualized] = useState(false);

  const Cell = ({ columnIndex, rowIndex, style, data: itemData }) => {
    const positionIndex = rowIndex * GRID_ROW_AMOUNT + columnIndex;
    const item = itemData[positionIndex];

    if (!item) return <></>;

    return (
      <div style={style}>
        <Component item={item} />
      </div>
    );
  };

  const columnCount = data?.length >= GRID_ROW_AMOUNT ? GRID_ROW_AMOUNT : data?.length;

  return (
    <Box sx={{ ...styles.root }}>
      {showVirtualized ? (
        <Box sx={styles.virtualizationContainer}>
          <Box sx={{ height: 630 }}>
            <AutoSizer>
              {({ height, width }) => (
                <Grid
                  columnCount={columnCount}
                  columnWidth={PROFILE_CARD_WIDTH + PADDING_PX}
                  height={height}
                  rowCount={Math.ceil(data.length / GRID_ROW_AMOUNT)}
                  rowHeight={PROFILE_CARD_HEIGHT + PADDING_PX}
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
              disabled={data?.length <= GRID_ROW_AMOUNT}
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
