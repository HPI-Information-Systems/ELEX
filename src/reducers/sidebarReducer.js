import {
  SIDEBAR_SHOW_INFO,
  SIDEBAR_SHOW_FILTER,
  SIDEBAR_SHOW_SEARCH,
  SIDEBAR_SHOW_GRAPH,
} from '../actions/types';

const INITIAL_STATE = { obj: { props: {}, type: '' }, type: '', currentView: 'graph' };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SIDEBAR_SHOW_INFO:
      if (!action.payload.obj)
        return {
          ...state,
          currentView: 'info',
        };

      return { ...state, obj: action.payload.obj, type: action.payload.type, currentView: 'info' };
    case SIDEBAR_SHOW_FILTER:
      return { ...state, currentView: 'filter' };
    case SIDEBAR_SHOW_SEARCH:
      return { ...state, currentView: 'search' };
    case SIDEBAR_SHOW_GRAPH:
      return { ...state, currentView: 'graph' };
    default:
      return state;
  }
}
