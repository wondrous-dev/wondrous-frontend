import { useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';

import { PROFILE_CARD_HEIGHT, PROFILE_CARD_WIDTH } from 'utils/constants';

import {
  ProfileContentGridAutosizer,
  ProfileContentGridButton,
  ProfileContentGridButtonContainer,
  ProfileContentGridContainer,
  ProfileContentGridContent,
  ProfileContentGridContentWrapper,
  ProfileContentGridWrapper,
} from './styles';

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
    <ProfileContentGridWrapper>
      {showVirtualized ? (
        <ProfileContentGridContainer>
          <ProfileContentGridAutosizer>
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
          </ProfileContentGridAutosizer>
          <ProfileContentGridButtonContainer>
            <ProfileContentGridButton onClick={() => setShowVirtualized(false)}>Show Less</ProfileContentGridButton>
          </ProfileContentGridButtonContainer>
        </ProfileContentGridContainer>
      ) : (
        <ProfileContentGridContentWrapper>
          <ProfileContentGridContent>
            {data?.slice(0, columnCount)?.map((item) => (
              <Component key={item.id} item={item} />
            ))}
          </ProfileContentGridContent>

          <ProfileContentGridButtonContainer>
            <ProfileContentGridButton onClick={() => setShowVirtualized(true)} disabled={data?.length <= GRID_ELEMENTS}>
              Show more
            </ProfileContentGridButton>
          </ProfileContentGridButtonContainer>
        </ProfileContentGridContentWrapper>
      )}
    </ProfileContentGridWrapper>
  );
};

export default ProfileContentGrid;
