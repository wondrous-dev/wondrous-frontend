import { ButtonUnstyled } from '@mui/base';
import { Box, Grid, Modal, Typography } from '@mui/material';
import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import {
  SearchResults,
  SearchResultCategory,
  SearchResultCategoryTitle,
  SearchResultItem,
} from 'components/GlobalSearch/styles';
import { DAOIcon } from 'components/Icons/dao';
import PodIcon from 'components/Icons/podIcon';
import SearchSuggestions from 'components/SearchSuggestions';
import { SEARCH_GLOBAL } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useReducer } from 'react';
import apollo from 'services/apollo';
import { GLOBAL_SEARCH_TYPES } from 'utils/constants';
import { useKeyPress } from 'utils/hooks';
import { Input, SpotlightFooter, Wrapper } from './styles';

interface Labels {
  label: string;
  defaultImg: any;
}

const LABELS_DEFAULT_IMAGES_MAP = {
  [GLOBAL_SEARCH_TYPES.ORGS]: {
    label: 'Organizations',
    defaultImg: () => <DAOIcon />,
  },
  [GLOBAL_SEARCH_TYPES.PODS]: {
    label: 'Pods',
    defaultImg: () => <PodIcon />,
  },
  [GLOBAL_SEARCH_TYPES.USERS]: {
    label: 'Users',
    defaultImg: () => <DefaultUserImage />,
  },
};

let timeout;

const initialState = {
  cursors: {
    parent: 0,
    child: 0,
  },
  options: {},
  isLoading: false,
};

const TYPES = {
  SET_CURSORS: 'SET_CURSORS',
  SET_OPTIONS: 'SET_OPTIONS',
  SET_LOADING: 'SET_LOADING',
};

enum DIRECTION {
  UP = 'UP',
  DOWN = 'DOWN',
}

const handleDirectionDown = (child, currentOptionLength, parent, optionsLength) => {
  if (child === currentOptionLength - 1) {
    if (parent === optionsLength - 1) {
      return {
        parent: 0,
        child: 0,
      };
    }
    return {
      parent: parent + 1,
      child: 0,
    };
  }
  return {
    parent,
    child: child + 1,
  };
};

const handleDirectionUp = (child, currentOptionLength, parent, optionsLength) => {
  if (child === 0) {
    if (parent === 0) {
      return {
        parent: 0,
        child: 0,
      };
    }
    return {
      parent: parent - 1,
      child: currentOptionLength - 1,
    };
  }
  return {
    parent,
    child: child - 1,
  };
};

const handleCursors = (state, direction) => {
  const { parent, child } = state.cursors;
  const { options } = state;
  const optionsKeys = Object.keys(options);
  const optionsLength = optionsKeys.length;
  const currentOption = options[optionsKeys[parent]];
  const currentOptionLength = currentOption?.length || 0;

  /*

  if direction is down we need to check if we are at the end of the current option
  if we are at the end we move to the next option and set the child to 0
  if we are not at the end we just increment the child

  if direction is up we need to check if we are at the end of the current option
  if we are at the end we move to the previous option and set the child to 0
  if we are not at the end we just decrement the child
  */

  switch (direction) {
    case DIRECTION.DOWN:
      return handleDirectionDown(child, currentOptionLength, parent, optionsLength);
    case DIRECTION.UP:
      return handleDirectionUp(child, currentOptionLength, parent, optionsLength);
    default:
      return state.cursors;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case TYPES.SET_CURSORS:
      return { ...state, cursors: handleCursors(state, action.payload) };
    case TYPES.SET_OPTIONS:
      return { ...state, options: action.payload };
    case TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const Spotlight = ({ onClose }) => {
  // const [options, setOptions] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const setOptions = (payload) => dispatch({ type: TYPES.SET_OPTIONS, payload });

  const setIsLoading = (payload) => dispatch({ type: TYPES.SET_LOADING, payload });

  const setCursors = (payload) => dispatch({ type: TYPES.SET_CURSORS, payload });

  const { options, cursors, isLoading } = state;

  const optionsKeys = useMemo(() => Object.keys(options), [options]);

  const downPress = useKeyPress('ArrowDown');
  const upPress = useKeyPress('ArrowUp');
  const enterPress = useKeyPress('Enter');

  // const [cursors, setCursors] = useState({
  //   parent: 0,
  //   child: 0,
  // });

  console.log(cursors, 'cursors');

  useEffect(() => {
    if (upPress && optionsKeys?.length) {
      setCursors(DIRECTION.UP);
    }
  }, [upPress, optionsKeys?.length]);

  useEffect(() => {
    if (downPress && optionsKeys?.length) {
      setCursors(DIRECTION.DOWN);
    }
  }, [downPress, optionsKeys?.length]);

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

  const handleKeydown = (e, type, entity) => {
    if (e.key === 'Enter') {
      handleRedirect(type, entity);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Wrapper width={600}>
        <Grid>
          <Input onChange={handleInputChange} placeholder="Select a command or search" />
        </Grid>
        <SearchSuggestions show={optionsKeys?.length === 0} onClose={onClose} />
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
                        onClick={() => handleRedirect(option, item)}
                        onKeyDown={(e) => handleKeydown(e, option, item)}
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

        <SpotlightFooter display="flex" justifyContent="space-between" alignItems="center" />
      </Wrapper>
    </Modal>
  );
};

export default Spotlight;
