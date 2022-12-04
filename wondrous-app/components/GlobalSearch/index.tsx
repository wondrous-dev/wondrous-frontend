import { Badge } from '@mui/material';
import { useRef } from 'react';

import { SearchIconWrapped } from 'components/SearchTasks/styles';
import { useGlobalContext, useHotkey } from 'utils/hooks';

import { useHotkeys } from 'react-hotkeys-hook';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { GlobalSearchWrapper, SearchIconWrapper, SearchWrapper } from './styles';

function GlobalSearch() {
  const { toggleSpotlight } = useGlobalContext();

  const showBadge = useHotkey();

  const handleInputExpand = () => toggleSpotlight();

  useHotkeys(HOTKEYS.GLOBAL_SEARCH, () => toggleSpotlight(), []);

  return (
    <GlobalSearchWrapper >
      <SearchWrapper onClick={handleInputExpand} >
        <Badge badgeContent={HOTKEYS.GLOBAL_SEARCH} color="primary" invisible={!showBadge} style={{ zIndex: 999 }}>
          <SearchIconWrapper>
            <SearchIconWrapped />
          </SearchIconWrapper>
        </Badge>
      </SearchWrapper>
      {/* <SearchSuggestions show={isExpanded && Object.keys(options)?.length === 0} onClose={() => {}} /> */}
    </GlobalSearchWrapper>
  );
}

export default GlobalSearch;
