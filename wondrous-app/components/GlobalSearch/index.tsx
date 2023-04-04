import { Badge } from '@mui/material';
import { useEffect, useRef } from 'react';

import { SearchIconWrapped } from 'components/SearchTasks/styles';
import { useGlobalContext, useHotkey, useHotKeysListener } from 'utils/hooks';

import { HOTKEYS } from 'utils/hotkeyHelper';
import { GlobalSearchWrapper, SearchIconWrapper, SearchWrapper } from './styles';

function GlobalSearch() {
  const { toggleSpotlight } = useGlobalContext();

  const showBadge = useHotkey();

  const handleInputExpand = () => toggleSpotlight();

  useHotKeysListener(HOTKEYS.GLOBAL_SEARCH, () => toggleSpotlight());

  return (
    <GlobalSearchWrapper>
      <SearchWrapper onClick={handleInputExpand}>
        <Badge badgeContent={HOTKEYS.GLOBAL_SEARCH} color="primary" invisible={!showBadge} style={{ zIndex: 999 }}>
          <SearchIconWrapper>
            <SearchIconWrapped />
          </SearchIconWrapper>
        </Badge>
      </SearchWrapper>
    </GlobalSearchWrapper>
  );
}

export default GlobalSearch;
