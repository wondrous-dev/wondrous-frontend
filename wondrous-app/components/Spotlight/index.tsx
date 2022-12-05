import { Drawer, Grid, Modal, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import {
  SearchResultCategory,
  SearchResultCategoryTitle,
  SearchResultItem,
  SearchResults,
} from 'components/GlobalSearch/styles';
import SearchSuggestions from 'components/SearchSuggestions';
import { SEARCH_GLOBAL } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useReducer } from 'react';
import apollo from 'services/apollo';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { GLOBAL_SEARCH_TYPES } from 'utils/constants';
import { useKeyPress } from 'utils/hooks';
import { DIRECTION, initialState, Labels, LABELS_DEFAULT_IMAGES_MAP, SUGGESTIONS, TYPES } from './constants';
import { Input, SpotlightFooter, Wrapper } from './styles';
import { reducer } from './utils';
import useMediaQuery from 'hooks/useMediaQuery';

let timeout;

const Spotlight = ({ onClose }) => {

  const {isMobileScreen} = useMediaQuery();
  const [state, dispatch] = useReducer(reducer, initialState);

  const setOptions = (payload) => dispatch({ type: TYPES.SET_OPTIONS, payload });

  const setIsLoading = (payload) => dispatch({ type: TYPES.SET_LOADING, payload });

  const setCursors = (payload) => dispatch({ type: TYPES.SET_CURSORS, payload });

  const hoverSetCursors = (payload) => dispatch({ type: TYPES.HOVER_SET_CURSORS, payload });

  const { options, cursors, isLoading } = state;

  const optionsKeys = useMemo(() => Object.keys(options), [options]);

  const downPress = useKeyPress('ArrowDown');
  const upPress = useKeyPress('ArrowUp');
  const enterPress = useKeyPress('Enter');

  useEffect(() => {
    if (upPress) {
      setCursors(DIRECTION.UP);
    }
  }, [upPress]);

  useEffect(() => {
    if (downPress) {
      setCursors(DIRECTION.DOWN);
    }
  }, [downPress]);

  const router = useRouter();

  const handleSearch = async (searchString: string) => {
    try {
      const { data } = await apollo.query({
        variables: { searchString },
        query: SEARCH_GLOBAL,
      });
      const items = Object.keys(data?.globalSearch).reduce((acc: any, next: any) => {
        if (Array.isArray(data?.globalSearch[next]) && data?.globalSearch[next]?.length) {
          acc[next] = data?.globalSearch[next];
        }
        return acc;
      }, {});
      setOptions({
        ...items,
        ...{
          orgs: data?.globalSearch[GLOBAL_SEARCH_TYPES.ORGS],
          pods: data?.globalSearch[GLOBAL_SEARCH_TYPES.PODS],
          users: data?.globalSearch[GLOBAL_SEARCH_TYPES.USERS],
        },
      });
    } catch (error) {
      setOptions({});
    }
  };

  const handleInputChange = (e) => {
    const searchString = e.target.value;
    clearTimeout(timeout);
    setIsLoading(true);

    timeout = setTimeout(async () => {
      if (!searchString) {
        setOptions([]);
      } else {
        handleSearch(searchString);
      }
      setIsLoading(false);
    }, 200);
  };

  const handleRedirect = (type, entity) => {
    onClose();
    if (type === GLOBAL_SEARCH_TYPES.ORGS)
      return router.push(`/organization/${entity.username}/boards?view=grid`, undefined, { shallow: true });
    if (type === GLOBAL_SEARCH_TYPES.PODS)
      return router.push(`/pod/${entity.id}/boards?view=grid`, undefined, { shallow: true });
    if (type === GLOBAL_SEARCH_TYPES.USERS)
      return router.push(`/profile/${entity.username}/about`, undefined, { shallow: true });
  };

  const handleOptionRedirect = () =>
    handleRedirect(optionsKeys[cursors.parent], options[optionsKeys[cursors.parent]][cursors.child]);

  const handleSuggestionRedirect = () => {
    const suggestion = SUGGESTIONS[cursors.child]?.key;
    router.push(`/search-result?suggestion=${suggestion}`);
    return onClose();
  };

  useEffect(() => {
    if (enterPress) {
      optionsKeys?.length ? handleOptionRedirect() : handleSuggestionRedirect();
    }
  }, [enterPress, optionsKeys?.length]);

  console.log(isMobileScreen, 'isMobileScreen')

  const WrapperComponent = isMobileScreen ? ({open, onClose, children}) => <Drawer anchor="top" open={open} onClose={onClose}>{children}</Drawer> : Modal;
  
  return (
    <WrapperComponent open onClose={onClose}>
      <Wrapper>
        <Grid>
          <Input onChange={handleInputChange} placeholder="Select a command or search" />
        </Grid>
        <SearchSuggestions
          show={optionsKeys?.length === 0}
          cursors={cursors}
          onClose={onClose}
          onCursorChange={(newCursors) => hoverSetCursors(newCursors)}
        />
        {optionsKeys?.length ? (
          <SearchResults>
            {optionsKeys.map((option, optionIdx) => {
              const { label, defaultImg }: Labels = LABELS_DEFAULT_IMAGES_MAP[option];
              return (
                <SearchResultCategory key={optionIdx}>
                  <SearchResultCategoryTitle>{label}</SearchResultCategoryTitle>
                  {options[option]?.length ? (
                    options[option].map((item, idx) => (
                      <SearchResultItem
                        key={idx}
                        onMouseEnter={() => hoverSetCursors({ parent: optionIdx, child: idx })}
                        isActive={cursors.parent === optionIdx && cursors.child === idx}
                        onClick={() => handleRedirect(option, item)}
                      >
                        {item.profilePicture ? (
                          <SafeImage width={29} height={29} src={item.profilePicture} alt="Profile picture" />
                        ) : (
                          defaultImg()
                        )}
                        {item.username}
                        {item.description ? <span>{item.description}</span> : null}
                      </SearchResultItem>
                    ))
                  ) : (
                    <span>No results found</span>
                  )}
                </SearchResultCategory>
              );
            })}
          </SearchResults>
        ) : null}

        <SpotlightFooter display="flex" justifyContent="space-between" alignItems="center">
          <Grid display="flex" gap="4px">
            <Typography fontFamily={typography.fontFamily} color={palette.grey250} fontSize="13px">
              <strong>↓ ↑ </strong>to navigate
            </Typography>
          </Grid>
          <Typography fontFamily={typography.fontFamily} color={palette.grey250} fontSize="13px">
            <strong>return</strong> to use
          </Typography>
          <Typography fontFamily={typography.fontFamily} color={palette.grey250} fontSize="13px">
            <strong>esc</strong> to dismiss
          </Typography>
        </SpotlightFooter>
      </Wrapper>
    </WrapperComponent>
  );
};

export default Spotlight;
