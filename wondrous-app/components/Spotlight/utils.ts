import { DIRECTION, SUGGESTIONS, TYPES } from './constants';

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
  let optionsLength = optionsKeys.length;
  const currentOption = options[optionsKeys[parent]];
  let currentOptionLength = currentOption?.length || 0;

  /*
  
    if direction is down we need to check if we are at the end of the current option
    if we are at the end we move to the next option and set the child to 0
    if we are not at the end we just increment the child
  
    if direction is up we need to check if we are at the end of the current option
    if we are at the end we move to the previous option and set the child to 0
    if we are not at the end we just decrement the child
  
  
    if optionsLength is 0 we assume we're in the search suggestions
    */

  if (optionsLength === 0) {
    currentOptionLength = SUGGESTIONS.length;
    optionsLength = SUGGESTIONS.length;
  }

  switch (direction) {
    case DIRECTION.DOWN:
      return handleDirectionDown(child, currentOptionLength, parent, optionsLength);
    case DIRECTION.UP:
      return handleDirectionUp(child, currentOptionLength, parent, optionsLength);
    default:
      return state.cursors;
  }
};

export const reducer = (state, action) => {
  switch (action.type) {
    case TYPES.HOVER_SET_CURSORS:
      return { ...state, cursors: action.payload };
    case TYPES.SET_CURSORS:
      return { ...state, cursors: handleCursors(state, action.payload) };
    case TYPES.SET_OPTIONS:
      return { ...state, options: action.payload, cursors: { parent: 0, child: 0 } };
    case TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};
