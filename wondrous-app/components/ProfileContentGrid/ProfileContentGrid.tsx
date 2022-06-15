import _ from 'lodash';
import { useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeGrid as Grid } from 'react-window';

import { PROFILE_CARD_HEIGHT, PROFILE_CARD_WIDTH } from 'utils/constants';

import {
  ProfileContentGridAutosizer,
  ProfileContentGridButton,
  ProfileContentGridButtonContainer,
  ProfileContentGridCell,
  ProfileContentGridContainer,
  ProfileContentGridContent,
  ProfileContentGridContentWrapper,
  ProfileContentGridLoading,
  ProfileContentGridLoadingWrapper,
  ProfileContentGridWrapper,
} from './styles';

const GRID_ELEMENTS = 4;
const PADDING = 18;
const SCROLL_BAR_OFFSET = 40;

const ProfileContentGridVirtualized = ({ data, Cell, columnCount, onClick }) => {
  const [gridRef, setGridRef] = useState(null);
  const [rowHeight, setRowHeight] = useState([]);
  useEffect(() => {
    if (gridRef) {
      setTimeout(() => {
        const gridEl = _.assign(gridRef, {});
        const gridElChildren = _.toArray(gridEl.children).map(
          ({ children }) => _.first(_.toArray(children)).offsetHeight
        );
        const gridRowHeight = _.chunk(gridElChildren, GRID_ELEMENTS).map((arr) => _.max(arr));
        setRowHeight(gridRowHeight);
        setGridRef(null);
      }, 500);
    }
  }, [gridRef]);

  return (
    <ProfileContentGridContainer>
      {!_.isEmpty(rowHeight) && (
        <ProfileContentGridAutosizer isVisible={true}>
          <AutoSizer>
            {({ height, width }) => (
              <Grid
                innerRef={setGridRef}
                columnCount={columnCount}
                columnWidth={() => PROFILE_CARD_WIDTH + PADDING}
                height={height}
                rowCount={Math.ceil(data.length / GRID_ELEMENTS)}
                rowHeight={(i) => rowHeight[i] + PADDING} // update row height on layout
                width={width + SCROLL_BAR_OFFSET}
                itemData={data}
              >
                {Cell}
              </Grid>
            )}
          </AutoSizer>
        </ProfileContentGridAutosizer>
      )}
      {_.isEmpty(rowHeight) && (
        <>
          {/* This is a hack to get the initial sizes of the elements */}
          <ProfileContentGridLoadingWrapper>
            <ProfileContentGridLoading />
          </ProfileContentGridLoadingWrapper>

          <ProfileContentGridAutosizer isVisible={false}>
            <AutoSizer>
              {({ height, width }) => (
                <Grid
                  innerRef={setGridRef}
                  columnCount={columnCount}
                  columnWidth={() => PROFILE_CARD_WIDTH + PADDING}
                  height={height}
                  rowCount={Math.ceil(data.length / GRID_ELEMENTS)}
                  rowHeight={(i) => rowHeight[i] ?? PROFILE_CARD_HEIGHT}
                  width={width + SCROLL_BAR_OFFSET}
                  itemData={data}
                >
                  {Cell}
                </Grid>
              )}
            </AutoSizer>
          </ProfileContentGridAutosizer>
        </>
      )}
      <ProfileContentGridButtonContainer>
        <ProfileContentGridButton onClick={onClick}>Show Less</ProfileContentGridButton>
      </ProfileContentGridButtonContainer>
    </ProfileContentGridContainer>
  );
};

const ProfileContentGrid = ({ data, Component }) => {
  const [showVirtualized, setShowVirtualized] = useState(false);

  const Cell = ({ columnIndex, rowIndex, style, data }) => {
    const positionIndex = rowIndex * GRID_ELEMENTS + columnIndex;
    const item = data[positionIndex];

    if (!item) return <></>;
    return (
      <ProfileContentGridCell style={style}>
        <Component item={item} />
      </ProfileContentGridCell>
    );
  };

  const columnCount = data?.length >= GRID_ELEMENTS ? GRID_ELEMENTS : data?.length;

  return (
    <ProfileContentGridWrapper>
      {showVirtualized ? (
        <ProfileContentGridVirtualized
          data={data}
          Cell={Cell}
          columnCount={columnCount}
          onClick={() => setShowVirtualized(false)}
        />
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
